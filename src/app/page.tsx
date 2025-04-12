"use client";
import Image from "next/image";

export default function Home() {
  const getResult = async () => {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: "value" }), // Replace with your data
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data); // Handle th
  };

  const handleClick = () => {
    getResult();
  };

  return (
    <div>
      <button className="bg-red-500" onClick={() => handleClick()}>
        sdsd
      </button>
    </div>
  );
}
