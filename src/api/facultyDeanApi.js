import { baseUrl } from "./authApi";

const facultyDeanApi = {
     getAllFacultyDeans: async (facultyId, deanId) => {
        try {
          const response = await fetch(
            `${baseUrl}facultyDeans?facultyId=${facultyId}&deanId=${deanId}`
          );
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
      assignDeanForFaculty: async ({ facultyId, deanId }) => {
        try {
          const response = await fetch(`${baseUrl}facultyDeans`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              facultyId,
              deanId,
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
      updateFacultyDean: async ({ id, facultyId, deanId }) => {
        try {
          const response = await fetch(`${baseUrl}facultyDeans/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              facultyId,
              deanId,
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
      getCurrentFacultyDean: async (facultyId) => {
        try {
          const response = await fetch(
            `${baseUrl}facultyDeans/current/${facultyId}`
          );
          
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
      getFacultyDean:async(facultyDeanId) => {
            try{
                const response = await fetch(`${baseUrl}facultyDeans/${facultyDeanId}`);
                const data = await response.json();

                return {data,status:response.status};
            }catch(error){
                if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
                else
                throw new Error(error.message)
            }
    },
      deleteFacultyDean: async (facultyDeanId) => {
        try {
          const response = await fetch(
            `${baseUrl}facultyDeans/${facultyDeanId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
    
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
export default facultyDeanApi;