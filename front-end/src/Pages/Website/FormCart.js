import React, { useState } from "react";

function FormCart() {
  const [productId, setProductId] = useState(""); // تعديل حسب الحاجة
  const [quantity, setQuantity] = useState("1");

  const handleSubmit = (event) => {
    event.preventDefault();

    // إعداد البيانات للإرسال
    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("quantity", quantity);

    // أرسل البيانات إلى الخادم
    fetch("your-backend-route", {
      // يجب تحديث هذا بمسار Laravel route الخاص بك
      method: "POST",
      body: formData,
      headers: {
        // تأكد من تضمين رأس CSRF token إذا كان مطلوبًا
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input
        type="hidden"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
      />
      <div className="col-lg-4 col-md-4 col-12 form-control">
        <div className="form-group quantity">
          <label htmlFor="quantity">Quantity</label>
          <select
            name="quantity"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <button className="btn" type="submit" style={{ width: "100%" }}>
          Add to Cart
        </button>
      </div>
    </form>
  );
}

export default FormCart;
