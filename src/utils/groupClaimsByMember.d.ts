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
export declare const groupClaimsByMember: (claims: Claim[]) => Record<number, {
    member_name: string;
    claims: Claim[];
}>;
export {};
