import { baseUrl } from "./authApi";

baseUrl
const applicantApi = {
createApplicant: async ({
   firstName,lastName,password,email
  }) => {
    try {
      const response = await fetch(`${baseUrl}applicants`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
         firstName,lastName,password,email
        }),
      });

      const data = await response.json();

      return { data, status: response.status };
    } catch (error) {
      if (error.message === "Failed to fetch")
        throw new Error(
          "Oops! We're having trouble connecting to the server. Please try again later."
        );
      else throw new Error(error.message);
    }
  },
    getApplicant : async(applicantId)=>{
            try{
                const response = await fetch(`${baseUrl}applicants/${applicantId}`);
                const data = await response.json();
                return { data, status : response.status };
            }catch(error){
                if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                    throw new Error(error.message)
            }
    
        },
     getApplicants: async ({ universityId, facultyId, status } = {}) => {
  try {
   

    const params = new URLSearchParams();
    if (facultyId) params.append("facultyId", facultyId);
    if (status)    params.append("status", status);

    const query = params.toString();
    const url = `${baseUrl}${universityId}/applicants${query ? `?${query}` : ""}`;

    const response = await fetch(url);
    const data = await response.json();
    return { data, status: response.status };
  } catch (error) {
    if (error.message === "Failed to fetch")
      throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
    else
      throw new Error(error.message);
  }
},
};
export default applicantApi;