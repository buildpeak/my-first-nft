const baseUrl = process.env.REACT_APP_API_BASE_URL;

export const createReceipt = async (nric, walletAddress) => {
  const res = await fetch(`${baseUrl}/api/v1/receipts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      NRIC: nric,
      WalletAddress: walletAddress,
    }),
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data.Receipt;
};

export const getReceipt = async (nric, walletAddress) => {
  const res = await fetch(
    `${baseUrl}/api/v1/receipts/${nric}/${walletAddress}`
  );
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data.Receipt;
};
