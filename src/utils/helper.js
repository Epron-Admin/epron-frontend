// Capitalize string

export const capitalize = (string) => {
  const result = string.charAt(0).toUpperCase() + string.slice(1);
  return result;
};

export const capitalizeEachWord = (string) => {
  const arr = string.split(" ");

  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  const newString = arr.join(" ");
  return newString;
};

export const getFirstWord = (string) => {
  const arr = string.split(" ");
  return arr[0];
};

// Comma seperated values
export const formatNumber = (num) => {
  num = +num;
  let str = num.toLocaleString("en-US");
  return str;
};

export const getTime = (time) => {
  time = new Date(time).toLocaleTimeString();
  let timeArr = time.split(" ");
  timeArr[0] =
    timeArr[0].charAt(1) === ":"
      ? timeArr[0].substr(0, 4)
      : timeArr[0].substr(0, 5);
  return timeArr.join("");
};

export const formatUrl = (name) => {
  return name.toLowerCase().replace(" ", "-");
};

export const generateRandomCharacters = (num) => {
  let nums = "0123456789";
  let letters = "abcdefghijklmnopqrstuvwxyz";
  let result = "";
  for (let i = 0; i < num; i++) {
    result =
      result +
      nums[Math.ceil(Math.random() * 9)] +
      letters[Math.ceil(Math.random() * 25)];
  }
  return result;
};

export const generatePaymentObj = (record, user) => {
  let userName = user.name.split(" ");
  let id = `${userName[0][0]}${user._id.substring(0, 6)}${
    userName[1][0]
  }${user.verifyToken.substring(0, 6)}${userName[1][1]}`;

  const paymentObj = {
    amount: +record.total,
    currency: "NGN",
    merchantRef: `EPR${generateRandomCharacters(2)}${record.equipment_pin}`,
    narration: "string",
    callBackUrl: "https://blackbox.epron.org.ng/verify-payment",
    // callBackUrl: "http://localhost:3000/verify-payment",
    splitCode: "",
    shouldTokenizeCard: false,
    customer: {
      customerId: id,
      customerLastName: userName[1],
      customerFirstName: userName[0],
      customerEmail: user.email,
      customerPhoneNumber: user.phoneNumer,
      customerAddress: "",
      customerCity: "",
      customerStateCode: "",
      customerPostalCode: "",
      customerCountryCode: "NG",
    },
    mcc: 0,
    merchantDescriptor: "string",
  };

  return paymentObj
};

// Check length of an object

//
