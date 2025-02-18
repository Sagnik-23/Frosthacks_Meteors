import WebcamComponent from "../components/Webcam";
import { useState } from "react";

import { ArrowLeft, SendHorizontal } from "lucide-react";
import { useNavbar } from "../contexts/NavbarContext";
import { InfinitySpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// API
import { get_medicine_names, send_number } from "../api";

// const demoData = {
//   data: {
//     general_instructions: "None",
//     medicines: [
//       {
//         dosage: "100mg",
//         frequency: "1 tab BID",
//         name: "Betaloc",
//         route: "oral",
//         special_instructions: "O Stoel",
//         websites: [],
//       },
//       {
//         dosage: "10 mg",
//         frequency: "1 tab BID",
//         name: "Dorzolamidum",
//         route: "oral",
//         websites: [],
//       },
//       {
//         dosage: "50 mg",
//         frequency: "2 tabs TID",
//         name: "Cimetidine",
//         route: "oral",
//         websites: [],
//       },
//       {
//         dosage: "50mg",
//         frequency: "1 tab QD",
//         name: "Oxprelol",
//         route: "oral",
//         special_instructions: "Adobe Stor",
//         websites: [],
//       },
//     ],
//   },
// };

function Scan() {
  const { isLoggedIn, userDetails } = useAuth();
  const navigate = useNavigate();
  const { setNavbar } = useNavbar();
  const [capture, setCapture] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    console.log("Submitting Image");
    console.log(image);
    setIsLoading(true);
    setNavbar(false);
    if (!image) return "No image found!";
    let blob = await fetch(image).then((r) => r.blob());
    const file = new File([blob], "prescription.png", { type: "image/png" });
    let data;
    try {
      if (
        isLoggedIn &&
        phoneNumber.length >= 10 &&
        e.target.textContent === "Ok"
      ) {
        console.log(
          "Submitting phone number  ",
          phoneNumber,
          " image and not sending token"
        );
        data = await get_medicine_names(file, userDetails?.token, phoneNumber);
      } else if (isLoggedIn) {
        console.log("Submitting Image and sending token");
        data = await get_medicine_names(file, userDetails?.token);
      } else if (
        !isLoggedIn &&
        phoneNumber.length >= 10 &&
        e.target.textContent === "Ok"
      ) {
        console.log("Submitting phone number  not  send token ", phoneNumber);
        data = await get_medicine_names(file, "", phoneNumber);
        console.log("radhe radhde");
      } else {
        console.log("Submitting Image not sending token");
        data = await get_medicine_names(file);
      }
      console.log("Response:", data);
      // if (e.target.textContent === "Ok" && phoneNumber !== "") {
      //   console.log("Submitting phone number: ", phoneNumber);
      //   await send_number(phoneNumber);
      // }
      setNavbar(true);
      setImage("");
      setIsLoading(false);
      navigate("/result", { state: { data: data.data } });
    } catch (err) {
      setErrorMessage("Something went wrong! Please try again");
      setNavbar(true);
      setIsLoading(false);
    }
    // const formData = new FormData();
    // formData.append("image", file);
    // if (location) {
    //   formData.append("location", JSON.stringify(location));
    // }
    // try {
    //   const response = await fetch("http://127.0.0.1:9999/", {
    //     method: "POST",
    //     body: formData,
    //   });
    //   if (response.status !== 200) {
    //     throw new Error("File upload unsuccessful!");
    //   }
    //   const data = await response.json();
    //   console.log("Response:", data);
    //   setNavbar(true);
    //   setImage("");
    //   setIsLoading(false);
    //   // Navigate to result page
    //   // TODO: change demoData to data
    //   navigate("/result", { state: { data: demoData } });
    // } catch (error) {
    //   console.error("Upload failed:", error);
    //   setErrorMessage("Something went wrong! Please try again");
    //   setNavbar(true);
    //   setIsLoading(false);
    //   navigate("/result", { state: { data: demoData } });
    // }
  };

  return (
    <>
      {isLoading ? (
        <div className="w-screen h-screen flex items-center justify-center">
          <div className="flex flex-col justify-center items-center">
            <InfinitySpin width="200" color="#4fa94d" />
            <div className="animate-pulse">Please wait AI is scanning</div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
          {capture ? (
            <>
              {/* Back Button Positioned at the Top */}

              {/* Webcam Component */}
              <div className="w-full flex items-center justify-center">
                <WebcamComponent setCapture={setCapture} setImage={setImage} />
                <div className="absolute top-5 left-5">
                  <button
                    className="bg-white px-4 py-2 rounded-lg shadow-md font-semibold text-gray-700 hover:bg-gray-200 transition"
                    onClick={() => setCapture(false)}
                  >
                    <ArrowLeft />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              {showPopup ? (
                <div className="px-6">
                  <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl flex flex-col items-center gap-3">
                    <button
                      className="bg-gray-600 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300"
                      onClick={() => setShowPopup(false)}
                    >
                      <ArrowLeft />
                    </button>
                    <p className="font-semibold text-2xl text-center">
                      Provide your phone number to get notified to take
                      medicines for this prescription
                    </p>
                    {image && (
                      <img
                        src={image}
                        alt="Preview"
                        className="h-40 object-cover rounded-lg shadow-lg"
                      />
                    )}
                    <input
                      type="text"
                      placeholder="Your phone number"
                      className="border-2 border-gray-400 px-4 py-2 w-full rounded"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    <div className="flex gap-6 justify-center items-center">
                      <button
                        className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 w-full disabled:bg-green-300"
                        onClick={handleSubmit}
                        disabled={phoneNumber === ""}
                      >
                        Ok
                      </button>
                      <button
                        className="bg-red-600 hover:bg-red-700 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 w-full text-nowrap"
                        onClick={handleSubmit}
                      >
                        Proceed anyway
                      </button>
                    </div>
                    <div className="text-red-500">{errorMessage}</div>
                  </div>
                </div>
              ) : (
                <div className="px-6">
                  <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-xl flex flex-col items-center gap-3">
                    {/* Image Upload Section */}
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                      Upload Your Prescription
                    </h2>
                    <input
                      onChange={handleFileChange}
                      type="file"
                      name="image"
                      id="image"
                      accept="image/*"
                      className="border-2 border-gray-300 my-6 px-4 py-2 rounded-lg w-full text-gray-600"
                    />
                    {image && (
                      <img
                        src={image}
                        alt="Preview"
                        className="h-40 object-cover rounded-lg shadow-lg"
                      />
                    )}
                    {/* Capture Button */}
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 w-full"
                      onClick={() => setCapture(true)}
                    >
                      Capture Instead
                    </button>
                    <button
                      className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 w-full disabled:bg-green-300"
                      disabled={image ? false : true}
                      onClick={() => setShowPopup(true)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Scan with AI
                        <SendHorizontal strokeWidth={2.5} />
                      </div>
                    </button>
                    <div className="text-red-500">{errorMessage}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Scan;
