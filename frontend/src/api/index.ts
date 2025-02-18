const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000"


export const fetchMedicineDetails = async (medicineName: string) => {
  try {
    const formData = new FormData();
    formData.append("name", medicineName);
    const response = await fetch(`${SERVER_URL}/get_medicine_detail`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.detail;
    
  }catch(err){
    console.error(err);
    throw err;
  }
};

export const fetchGenericName = async (name : string) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    const response = await fetch(`${SERVER_URL}/generic_name_search`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.results;
  }catch(err){
    console.error(err);
    throw err;
  }
}


export const fetchAIResponse = async (message: string): Promise<string> => {
  try {
    console.log("Sending message to AI:", message);
    const formData = new FormData()
    formData.append("text", message);
    const response = await fetch(`${SERVER_URL}/ai_chat`, {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      body: formData, // Send as JSON
    });

    console.log("Server Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch AI response");
    }

    const data = await response.json(); // AI returns a string wrapped in JSON
    console.log("AI Response:", data.response);
    return data.response;  // Extract response from JSON
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Error: AI is unavailable.";
  }
};


async function get_medicine_names(image: File, token?: string, phoneNumber?:string){
    const formData = new FormData();
    formData.append("image", image);
    if(token){
        formData.append("token", token);
    }
    if(phoneNumber){
      formData.append("num", phoneNumber);
    }
    try {
      const response = await fetch(`${SERVER_URL}/get_medicine_names`, {
        method: "POST",
        body: formData,
      });
      if (response.status !== 200) {
        throw new Error("File upload unsuccessful!");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Upload failed:", error)
      throw error;
    }
}

async function get_medicine_links(name: string){
  try{
    const formData = new FormData()
    formData.append("text", name);
    const response = await fetch(`${SERVER_URL}/get_medicine_links`, {
      method: "POST",
      body: formData
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch medicine links!");
    }
    const data = await response.json();
    return data;
  }catch(err){
    console.error(err);
    throw err;
  }
}

async function get_location(geoLocation: {latitude: number, longitude: number}){
  try{
    const formData = new FormData()
    formData.append("latitude", "@"+JSON.stringify(geoLocation.latitude));
    formData.append("longitude", JSON.stringify(geoLocation.longitude));
    const response = await fetch(`${SERVER_URL}/get_location`, {
      method: "POST",
      body: formData
    });
    if (response.status !== 200) {
      throw new Error("Failed to fetch medical shop locations!");
    }
    const data = await response.json()
    return data;
  }catch(err){
    console.log(err);
    throw err;
  }
}

async function get_history(token: string){
  try{
    const formData = new FormData()
    formData.append("token", token);
    const response = await fetch(`${SERVER_URL}/history`, {
      method: "POST",
      body: formData
    })
    if(response.status !== 200){
      throw new Error("Failed to fetch history!");
    }
    const data = await response.json()
    return data;
  }catch(err){
    console.log(err);
    throw err;
  }
}

async function send_number(num: string){
  try{
    const formData = new FormData()
    formData.append("num", num);
    formData.append("msg", "Don't forget to take your medicines and get well soon 😊");
    const response = await fetch(`${SERVER_URL}/send_msg`,{
      method: "POST",
      body: formData
    });
    if(response.status !== 200){
      throw new Error("Failed to send message!");
    }
  }catch(err){
    throw err;
  }
}

export {get_medicine_names, get_medicine_links, get_location, get_history, send_number}