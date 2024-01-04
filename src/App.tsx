import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

interface ProductType {
  code: string;
  media_url: string;
  name: string;
  price: number;
  stock: number;
}

interface DataType {
  product: ProductType;
  quantity: number;
}

const locale = "en";

function App() {
  const [dataShop, setDataShop] = useState<DataType[]>([]);

  const [today, setDate] = useState<Date>(new Date()); // Save the current date to be able to trigger an update

  useEffect(() => {
    const timer = setInterval(() => {
      // Creates an interval which will update the current data every minute
      // This will trigger a rerender every component that uses the useDate hook.
      setDate(new Date());
    }, 60 * 1000);
    return () => {
      clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
    };
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get<DataType[]>(
          "https://spe-academy.spesolution.com/api/recruitment",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer o7Ytbt9XQLI3PgtebJfKSXKEf0XHU74Y",
            },
          }
        );
        setDataShop(data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("error message: ", error.message);
        } else {
          console.log("unexpected error: ", error);
        }
      }
    };
    fetch();
  }, []);

  const formatPrice = (price: number) => {
    const priceFormat = new Intl.NumberFormat().format(price);
    return `IDR ${priceFormat}`;
  };

  const totalPriceCalc = () => {
    const totalPrice = dataShop.reduce(
      (prev, next) => prev + next.quantity * next.product.price,
      0
    );
    return formatPrice(totalPrice);
  };

  const handleQuantity = (qty: string, index: number) => {
    let temp = [...dataShop];
    dataShop[index].quantity = parseInt(qty);
    setDataShop(temp);
  };

  const showRealtime = () => {
    const date = `${today.toLocaleDateString(locale, {
      month: "long",
    })} ${today.getDate()}st, ${today.getFullYear()} - `;
    return date;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-blackShop w-full h-48 relative">
        <div className="flex flex-col w-full text-center absolute bottom-0">
          <p className="text-greenShop text-lg">{"< SPE / FRONTEND >"}</p>
          <p className="text-greenShop text-lg">{showRealtime()}</p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blueShop to-pinkShop w-full h-96"></div>
      <div className="bg-blackShop grid grid-cols-6 w-full">
        <div className="col-span-4 flex justify-center align-middle">
          <p className="text-whiteSmokeShop">PRODUCT</p>
        </div>
        <div className="col-span-1 flex justify-center align-middle">
          <p className="text-whiteSmokeShop">QUANTITY</p>
        </div>
        <div className="col-span-1 flex justify-center align-middle">
          <p className="text-whiteSmokeShop">SUBTOTAL</p>
        </div>
      </div>
      {dataShop.map((data, index) => (
        <div
          key={data.product.name + `~${index}`}
          className="grid grid-cols-6 w-full"
        >
          <div className="col-span-4 grid grid-cols-3 gap-2 w-full">
            <div className="col-span-1">
              <img
                alt={data.product.name}
                src={data.product.media_url}
                width={320}
                height={320}
              />
            </div>
            <div className="col-span-2 flex flex-col gap-2 pt-4">
              <p className="text-sm text-blue-400">{data.product.code}</p>
              <p className="text-lg text-slate-700">{data.product.name}</p>
              <p className="text-sm text-slate-400">
                {formatPrice(data.product.price)}
              </p>
              <p className="text-sm text-red-400">{`${data.product.stock} in stock`}</p>
            </div>
          </div>
          <div className="col-span-1 flex">
            <input
              className="text-center"
              type="number"
              value={data.quantity}
              max={data.product.stock}
              onChange={(e) => handleQuantity(e.target.value, index)}
            />
            {/* <p className="text-center">{data.quantity}</p> */}
          </div>
          <div className="col-span-1 flex flex-col justify-center align-middle">
            <p className="text-center">
              {formatPrice(data.quantity * data.product.price)}
            </p>
          </div>
        </div>
      ))}
      <div className="bg-blackShop grid grid-cols-6 w-full">
        <div className="col-span-4 flex justify-center align-middle"></div>
        <div className="col-span-1 flex justify-center align-middle">
          <p className="text-whiteSmokeShop">TOTAL</p>
        </div>
        <div className="col-span-1 flex justify-center align-middle">
          <p className="text-whiteSmokeShop">{totalPriceCalc()}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
