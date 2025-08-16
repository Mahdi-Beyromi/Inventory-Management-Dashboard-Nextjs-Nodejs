import React from "react";

type ProductImageProps = {
  productName: string;
  index: number;
  size?: "sm" | "md" | "lg";
};

const ProductImage = ({ productName, index, size = "sm" }: ProductImageProps) => {
  // Use local placeholder images or generate colored divs
  const colors = [
    "bg-blue-400", 
    "bg-green-400", 
    "bg-purple-400", 
    "bg-yellow-400", 
    "bg-red-400"
  ];
  
  const sizeClasses = {
    sm: "w-14 h-14 text-lg",
    md: "w-20 h-20 text-xl",
    lg: "w-36 h-36 text-3xl"
  };
  
  const colorIndex = index % colors.length;
  
  return (
    <div 
      className={`${sizeClasses[size]} rounded-lg ${colors[colorIndex]} flex items-center justify-center text-white font-bold`}
      title={productName}
    >
      {productName.charAt(0).toUpperCase()}
    </div>
  );
};

export default ProductImage;
