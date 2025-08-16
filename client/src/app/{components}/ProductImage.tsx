import React from "react";

type ProductImageProps = {
  productName: string;
  index: number;
};

const ProductImage = ({ productName, index }: ProductImageProps) => {
  // Use local placeholder images or generate colored divs
  const colors = [
    "bg-blue-400", 
    "bg-green-400", 
    "bg-purple-400", 
    "bg-yellow-400", 
    "bg-red-400"
  ];
  
  const colorIndex = index % colors.length;
  
  return (
    <div 
      className={`w-14 h-14 rounded-lg ${colors[colorIndex]} flex items-center justify-center text-white font-bold text-lg`}
      title={productName}
    >
      {productName.charAt(0).toUpperCase()}
    </div>
  );
};

export default ProductImage;
