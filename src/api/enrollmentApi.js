import {baseUrl}from './authApi'

const enrollmentApi = {
 getEnrollments: async ({
  applicantId,
  programId,
  universityId,
  facultyId,
  academicYear,
  studentNumber,
  status,
  yearLevel,
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (applicantId)   params.append("applicantId", applicantId);
    if (programId)     params.append("programId", programId);
    if (universityId)  params.append("universityId", universityId);
    if (facultyId)     params.append("facultyId", facultyId);
    if (academicYear)  params.append("academicYear", academicYear);
    if (studentNumber) params.append("studentNumber", studentNumber);
    if (status)        params.append("status", status);
    if (yearLevel)     params.append("yearLevel", yearLevel);

    const query = params.toString();
    const url = `${baseUrl}enrollments${query ? `?${query}` : ""}`;

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
        createEnrollment : async({  applicantId, programId, facultyId, academicYear, yearLevel}) => {
                try{
                    const response = await fetch(`${baseUrl}enrollments`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        applicantId, programId, facultyId, academicYear, yearLevel
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
        updateEnrollment : async({enrollmentId, applicantId, programId, facultyId, academicYear, yearLevel, status}) => {
                try{
                    const response = await fetch(`${baseUrl}enrollments/${enrollmentId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        applicantId, programId, facultyId, academicYear, yearLevel, status
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
        deleteEnrollment : async(enrollmentId) => {
                try{
                    const response = await fetch(`${baseUrl}enrollments/${enrollmentId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                
                return {status:response.status};
                }catch(error){
                    if(error.message === "Failed to fetch")
                    throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                    else
                    throw new Error(error.message)
                }
        },
};
export default enrollmentApi;