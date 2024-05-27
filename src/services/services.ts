import api from "./Api";

interface OTPRequest {
  mobile_number: string;
}

interface OTPResponse {
  data: {
    data: {
      token: string;
      user_id: string;
    };
  };
}

interface UploadData {
  file: File;
  major_head: string;
  minor_head: string;
  document_date: string;
  document_remarks: string;
  tags: Array<{ tag_name: string }>;
  user_id: string;
}

interface SearchParams {
  major_head: string;
  minor_head: string;
  from_date: string;
  to_date: string;
  tags: Array<{ tag_name: string }>;
  uploaded_by: string;
  start: number;
  length: number;
  filterId: string;
  search: {
    value: string;
  };
}

export const generateOTP = (mobile_number: string) => {
  return api.post<OTPRequest, OTPResponse>("/generateOTP", { mobile_number });
};

export const validateOTP = (mobile_number: string, otp: string) => {
  return api.post<OTPRequest, OTPResponse>("/validateOTP", {
    mobile_number,
    otp,
  });
};

export const uploadFile = (data: UploadData, token: string) => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("data", JSON.stringify(data));

  return api.post("/saveDocumentEntry", formData, {
    headers: {
      token: token,
    },
  });
};

export const searchDocuments = (searchParams: SearchParams, token: string) => {
  return api.post("/searchDocumentEntry", searchParams, {
    headers: { token: token },
  });
};

export const fetchDocumentTags = (token: string) => {
  return api.post(
    "/documentTags",
    { term: "" },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};
