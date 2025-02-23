// src/utils/groupClaimsByMember.ts

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

// ✅ 멤버별 청구 내역을 그룹화하는 함수
export const groupClaimsByMember = (claims: Claim[]) => {
  return claims.reduce((acc, claim) => {
    const memberId = claim.member.id;

    if (!acc[memberId]) {
      acc[memberId] = {
        member_name: claim.member.name,
        claims: [],
      };
    }

    acc[memberId].claims.push(claim);
    return acc;
  }, {} as Record<number, { member_name: string; claims: Claim[] }>);
};
