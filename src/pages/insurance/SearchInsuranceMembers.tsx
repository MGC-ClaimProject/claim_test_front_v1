import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate 추가
import { auth } from "../../api/axiosInstance";


interface Member {
  id: number;
  name: string;
  phone: string;
  birth: string;
  gender: string;
  relation: string;
}

interface Insurance {
  id: number;
  policy_name: string;
  company: string;
  premium: number;
}

interface MemberWithInsuranceCount extends Member {
  insuranceCount: number;
}

const SearchInsuranceMembers: React.FC = () => {
  const navigate = useNavigate(); // ✅ 네비게이션 훅 추가
  const [members, setMembers] = useState<MemberWithInsuranceCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingMemberId, setUpdatingMemberId] = useState<number | null>(null);

  // ✅ 가족 멤버 + 가입 보험 개수 가져오기
  const fetchMembersWithInsuranceCount = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await auth.get<Member[]>("/members/");

      // ✅ 각 멤버의 보험 개수를 가져오기 위해 개별 API 호출
      const membersWithInsurance = await Promise.all(
        response.data.map(async (member) => {
          try {
            const insuranceResponse = await auth.get<Insurance[]>(`/insurances/${member.id}/`);
            return { ...member, insuranceCount: insuranceResponse.data.length };
          } catch {
            return { ...member, insuranceCount: 0 };
          }
        })
      );

      setMembers(membersWithInsurance);
    } catch (error) {
      console.error("❌ 멤버 조회 실패:", error);
      setError("멤버 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 멤버별 보험 정보 새로 조회 (POST 요청)
  const refreshInsuranceForMember = async (member: Member) => {
    setUpdatingMemberId(member.id);
    setError(null);
    try {
      await auth.post(`/insurances/update/${member.id}/`); // ✅ 경로 파라미터로 멤버 ID 포함
      await fetchMembersWithInsuranceCount(); // ✅ 멤버 + 보험 개수 다시 가져오기
    } catch (error) {
      setError("보험 정보를 새로 불러오는 데 실패했습니다.");
    } finally {
      setUpdatingMemberId(null);
    }
  };

  // ✅ 특정 멤버의 보험 리스트 페이지로 이동
  const handleMemberClick = (memberId: number, memberName: string) => {
    navigate(`/main/insurances`, { state: { memberId, memberName } });
  };

  // ✅ 페이지 로드 시 가족 구성원 불러오기
  useEffect(() => {
    fetchMembersWithInsuranceCount();
  }, []);

  return (
    <div className="insurance-search-container">
      <h2 style={{color: "#fff"}}>👥 가족 구성원 조회</h2>

      {loading ? (
        <p>⏳ 멤버 정보를 불러오는 중...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : members.length === 0 ? (
        <p>❌ 등록된 멤버가 없습니다.</p>
      ) : (
        <table className="member-table" style={{textAlign:"center"}}>
          <thead>
            <tr>
              <th>이름</th>
              <th>가입 보험</th>
              <th>새로 조회</th> {/* ✅ 버튼 항상 보이도록 설정 */}
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td
                  className="clickable"
                  onClick={() => handleMemberClick(member.id, member.name)} // ✅ 이름 클릭 시 이동
                >
                  {member.name} ({member.relation})
                </td>
                <td
                  className="clickable"
                  onClick={() => handleMemberClick(member.id, member.name)} // ✅ 가입 보험 개수 클릭 시 이동
                >
                  {member.insuranceCount} 개
                </td>
                <td>
                  <button
                    className="search-button"
                    onClick={() => refreshInsuranceForMember(member)}
                    disabled={updatingMemberId === member.id}
                  >
                    {updatingMemberId === member.id ? "⏳ 조회 중..." : "🔄 새로 조회하기"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SearchInsuranceMembers;
