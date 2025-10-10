export const baseUrl = "https://localhost:5001/api/";
const authApi = {
    isEmailAlreadyExists:async(email) => {
        
        try
        {
            const response = await fetch(`${baseUrl}auth/check-email/${email}`);
        
            const data = await response.json();
            return data.exists;
        }catch(error)
        {
            if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.")
        }
    },
    sendVerificationCode:async(email) => {
        try{
            const response = await fetch(`${baseUrl}auth/verify-email`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email
                })
            })
            const data = await response.json();
            return {data,status:response.status}
        }catch(error)
        {
            if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
            else
                throw new Error(error.message)
        }
    },
    isVerificationCodeValid:async(email,code) => {
            try{
                const response = await fetch(`${baseUrl}auth/confirm-verification`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    code
                })
            });
            
            return response.status === 200
            }catch(error)
        {
            if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
            else
                throw new Error(error.message)
        }
    },
    registerUniversityAmin:async({firstName,lastName,password,email}) => {
            try{
                const response = await fetch(`${baseUrl}auth/register/university-admin`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    password,
                    email,
                })
            })
            const data = await response.json();
            return {data, status:response.status};
            }catch(error)
        {
            if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
            else
                throw new Error(error.message)
        }
    },
    login : async({email, password})=>{
        try{
            const response = await fetch(`${baseUrl}auth/login`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });
            const data = await response.json();
            return {data, status : response.status};
        }catch(error){
            if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
            else
                throw new Error(error.message)
        }
    },
    forgotPassword : async(email)=>{
        try{
            const response = await fetch(`${baseUrl}auth/forgot-password`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email
                })
            });
        }catch(error){
            if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
            else
                throw new Error(error.message)
        }
    },
    resetPassword : async({email, token, newPassword})=>{
        try{
            const response = await fetch(`${baseUrl}auth/reset-password`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    token,
                    newPassword
                })
            });
            if(response.status === 400){
                throw new Error("Your password reset link is invalid or has expired. ");
            }
            
        }catch(error){
            if(error.message === "Failed to fetch")
                throw new Error("Oops! We're having trouble connecting to the server. Please try again later.");
            else
                throw new Error(error.message)
        }
    },
    

};
export default authApi;