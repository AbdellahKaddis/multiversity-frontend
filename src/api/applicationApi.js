import { baseUrl } from "./authApi";

baseUrl
const applicationApi = {
getApplications: async ({ universityId, facultyId, programId, applicantId } = {}) => {
  try {
    const params = new URLSearchParams();
    if (universityId) params.append("universityId", universityId);
    if (facultyId)    params.append("facultyId", facultyId);
    if (programId)    params.append("programId", programId);
    if (applicantId)  params.append("applicantId", applicantId);

    const query = params.toString();
    const url = `${baseUrl}applications${query ? `?${query}` : ""}`;

    const response = await fetch(url);
                const data = await response.json();
                return { data, status : response.status };
            }catch(error){
                if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                    throw new Error(error.message)
            }
    
        },
            getApplication : async(applicantId)=>{
            try{
                const response = await fetch(`${baseUrl}applications/${applicantId}`);
                const data = await response.json();
                return { data, status : response.status };
            }catch(error){
                if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                    throw new Error(error.message)
            }
    
        },
        createApplication : async({ applicantId, programId, grade, bacSerie, bacYear, bacMention, fileUrl, applicant }) => {
                try{
                    const response = await fetch(`${baseUrl}applications`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        applicantId, programId, grade, bacSerie, bacYear, bacMention, fileUrl, applicant
                    })
                });
    
                const data = await response.json();

                return {data,status:response.status};
                }catch(error){
                    if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                    else
                    throw new Error(error.message)
                }
        },
         updateApplicationStatus : async(applicationId, status, reviewerId=null) => {
                try{
                    const response = await fetch(`${baseUrl}applications/${applicationId}/status`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status, reviewerId
                    })
                });
 

                return {status:response.status};
                }catch(error){
                    if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                    else
                    throw new Error(error.message)
                }
        },
deleteApplication: async (applicationId) => {
    try {
      const response = await fetch(`${baseUrl}applications/${applicationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return { status: response.status };
    } catch (error) {
      if (error.message === "Failed to fetch")
        throw new Error(
          "Oops! We're having trouble connecting to the server. Please try again later."
        );
      else throw new Error(error.message);
    }
  },
};
export default applicationApi;