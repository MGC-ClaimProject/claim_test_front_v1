import React, { useState, useEffect } from "react";
import { auth } from "../../api/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore"; // ✅ Zustand 사용
import { groupClaimsByMember } from "../../utils/groupClaimsByMember";
import "../../styles/pages/claim/claimsListPage.css";
import { CLAIM_STATUS_CHOICES } from "../../constants/choices"; // ✅ 청구 상태 매핑

interface Member {
  id: number;
  name: string;
}

interface Claim {
  id: number;
  member: Member;
  insured_name: string;
  incident_type: string;
  incident_date: string;
  claim_status: string;
}

type SortKey = "member_name" | "incident_type" | "incident_date" | "status";

const ClaimsListPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setClaimData, claimData } = useAuthStore(); // ✅ Zustand에서 setClaimData 가져오기
  const memberId = location.state?.memberId ?? claimData?.memberId; // ✅ 상태에서 memberId 가져오기
  const currentYear = new Date().getFullYear().toString();

  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeMember, setActiveMember] = useState<number | "ALL">("ALL");
  const [selectedYear, setSelectedYear] = useState<string>(currentYear);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey | null; direction: "asc" | "desc" }>({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    fetchClaims(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    if (memberId) {
      setActiveMember(Number(memberId));
    }
  }, [memberId, claims]);

  const fetchClaims = async (year: string) => {
    setIsLoading(true);
    try {
      const response = await auth.get(`/claims/?year=${year}`);
      if (response.status === 200) {
        setClaims(response.data);
      }
    } catch (error) {
      console.error("❌ 청구 리스트 불러오기 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedClaims = groupClaimsByMember(claims);

  const filteredClaims =
    activeMember === "ALL"
      ? claims
      : claims.filter((claim) => claim.member.id === activeMember);

  const formatDate = (dateString: string) => {
    const [, month, day] = dateString.split("-");
    return `${month}-${day}`;
  };

  const handleSort = (key: SortKey) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleRowClick = (claimId: number) => {
    setClaimData({ claimId }); // ✅ Zustand에 claimId 저장
    navigate("/main/claims/detail"); // ✅ 상태가 저장된 후 상세페이지로 이동
  };

  const sortedClaims = [...filteredClaims].sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue: string | number = "";
    let bValue: string | number = "";

    switch (sortConfig.key) {
      case "incident_date":
        aValue = parseInt(a.incident_date.replace(/-/g, ""), 10);
        bValue = parseInt(b.incident_date.replace(/-/g, ""), 10);
        break;
      case "member_name":
        aValue = a.member.name;
        bValue = b.member.name;
        break;
      case "status":
        aValue = CLAIM_STATUS_CHOICES[a.claim_status] || "알 수 없음";
        bValue = CLAIM_STATUS_CHOICES[b.claim_status] || "알 수 없음";
        break;
      default:
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
    }

    return sortConfig.direction === "asc" ? (aValue < bValue ? -1 : 1) : (aValue > bValue ? -1 : 1);
  });

  return (
    <div className="claim-page-container">
      <div className="claim-list-container">
        <div className="header-container">
          <h2>📜 모든 청구내역</h2>
          <select
            className="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value={currentYear}>{currentYear}</option>
            <option value="ALL">전체</option>
            {Array.from({ length: 5 }, (_, i) => {
              const year = (parseInt(currentYear) - i - 1).toString();
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        {isLoading ? (
          <p>⏳ 불러오는 중...</p>
        ) : (
          <div className="member-section">
            <div className="name-index">
              <span
                className={`name-item ${activeMember === "ALL" ? "active" : ""}`}
                onClick={() => setActiveMember("ALL")}
              >
                ALL
              </span>
              {Object.entries(groupedClaims).map(([memberId, { member_name }]) => (
                <span
                  key={memberId}
                  className={`name-item ${activeMember === Number(memberId) ? "active" : ""}`}
                  onClick={() => setActiveMember(Number(memberId))}
                >
                  {member_name}
                </span>
              ))}
            </div>

            <table className="claim-table">
              <thead>
                <tr>
                  <th>No.</th> {/* ✅ 순차적인 번호 */}
                  <th onClick={() => handleSort("member_name")}>👤</th>
                  <th onClick={() => handleSort("incident_type")}>🚑</th>
                  <th onClick={() => handleSort("incident_date")}>📅</th>
                  <th onClick={() => handleSort("status")}>📌</th> {/* ✅ 기존 status 유지 */}
                </tr>
              </thead>
              <tbody>
                {sortedClaims.map((claim, index) => (
                  <tr
                    key={claim.id}
                    onClick={() => handleRowClick(claim.id)} // ✅ 클릭 시 상태 저장 후 페이지 이동
                    style={{ cursor: "pointer" }}
                  >
                    <td>{index + 1}</td> {/* ✅ 순차적인 번호 표시 */}
                    <td>{claim.member.name}</td>
                    <td>{claim.incident_type}</td>
                    <td>{formatDate(claim.incident_date)}</td>
                    <td>{CLAIM_STATUS_CHOICES[claim.claim_status] || ""}</td> {/* ✅ 기존 status 활용 */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimsListPage;
