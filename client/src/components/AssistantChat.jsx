import axios from "axios";
import { useState } from "react";
import { useAppContext } from "../context/Appcontext";
import ProductCard from "./ProductCard";

const AssistantChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", type: "text", text: "Hi 👋 What are we cooking today?" }
  ]);
  const [input, setInput] = useState("");

  const { product: allProducts } = useAppContext();

  const parseIngredients = (ingredientsText) => {
    return ingredientsText
      .toLowerCase()
      .split(",")
      .map(i => i.trim())
      .filter(Boolean);
  };

  const mapIngredientsToProducts = (ingredientsText) => {
    const ingredients = parseIngredients(ingredientsText);

    return allProducts
      .filter(product =>
        ingredients.some(ing =>
          product.name.toLowerCase().includes(ing) ||
          product.category.toLowerCase().includes(ing)
        )
      )
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages(prev => [
      ...prev,
      { role: "user", type: "text", text: userMessage }
    ]);

    setInput("");

    try {
      const { data } = await axios.post("/api/assistant/chat", {
        message: userMessage
      });

      if (data.success) {
        const ingredientsText = data.reply; 

        const matchedProducts =
          allProducts?.length
            ? mapIngredientsToProducts(ingredientsText)
            : [];

        setMessages(prev => [
          ...prev,
          {
            role: "bot",
            type: "text",
            text: ingredientsText
          },
          ...(matchedProducts.length
            ? [{
                role: "bot",
                type: "products",
                products: matchedProducts
              }]
            : [])
        ]);
      } else {
        throw new Error();
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: "bot",
          type: "text",
          text: "Sorry, something went wrong. Please try again."
        }
      ]);
    }
  };

  const renderMessages = () =>
    messages.map((msg, idx) => {
      if (msg.type === "text") {
        return (
          <div
            key={idx}
            className={`p-2 rounded-md max-w-[80%] ${
              msg.role === "user"
                ? "bg-primary-dull/75 text-white ml-auto"
                : "bg-gray-200/75 text-gray-800"
            }`}
          >
            {msg.text}
          </div>
        );
      }

      if (msg.type === "products") {
        return (
          <div key={idx} className="flex gap-3 overflow-x-auto">
            {msg.products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        );
      }

      return null;
    });

  return (
    <>
      {/* Floating Assistant Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-primary w-14 h-14 rounded-full shadow-lg"
        >
          🤖
        </button>
      )}

      {/* Side Chat Panel */}
      {open && (
        <div className="fixed top-4 right-4 h-[calc(100%-2rem)] w-[35%] bg-white shadow-2xl flex flex-col rounded-2xl overflow-hidden z-[9999]">

          {/* Close Button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute -top-4 -right-4 w-10 h-10 bg-primary-dull text-white rounded-full flex items-center justify-center shadow-xl z-[10000]"
          >
            ✕
          </button>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {renderMessages()}
          </div>

          {/* Input */}
          <div className="p-4 border-t flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded px-3 py-2"
              placeholder="Dish Name..."
            />
            <button
              onClick={sendMessage}
              className="bg-primary/65 text-white px-4 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantChat;
