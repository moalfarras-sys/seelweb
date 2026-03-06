export type ContractSummaryInput = {
  id: string;
  token: string;
  status: string;
  contractNumber: string;
  signedAt: Date | string | null;
  signedByName?: string | null;
  createdAt?: Date | string;
};

export function isFinalContractStatus(status: string) {
  return status === "SIGNED" || status === "LOCKED";
}

export function toContractSummary(contract: ContractSummaryInput) {
  return {
    id: contract.id,
    token: contract.token,
    status: contract.status,
    contractNumber: contract.contractNumber,
    signedAt: contract.signedAt,
    signedByName: contract.signedByName ?? null,
    createdAt: contract.createdAt ?? null,
    pageUrl: `/vertrag/${contract.token}`,
    pdfUrl: `/api/vertrag/${contract.token}/pdf?download=1`,
    pdfPreviewUrl: `/api/vertrag/${contract.token}/pdf`,
    isSigned: isFinalContractStatus(contract.status),
  };
}
