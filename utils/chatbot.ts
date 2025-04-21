// Simple rule-based chatbot response generator

const packageResponses = [
    "We offer a variety of packages including MobileOnly, BroadbandOnly, and TabletOnly. You can also customize your own package based on your usage needs.",
    "Our most popular package is the TriplePackage which includes mobile, broadband, and tablet services at a discounted rate.",
    "If you order through the app, you'll automatically receive a 15% discount on any package!",
    "You can view all our packages in the Packages tab. Each package has different data, call, and text allowances.",
    "Yes, we offer customized packages. You can select the amount of data, minutes, and texts that best suit your needs.",
  ];
  
  const billingResponses = [
    "Your bill is generated on the same day each month based on your subscription start date. You can view and pay your bills in the Account section.",
    "We accept credit card payments through the app. All transactions are secured with VISACheck verification.",
    "If you have any questions about specific charges on your bill, you can submit an enquiry or contact our customer service team.",
    "You can set up automatic payments in the Payment Methods section of your account.",
    "Bills are typically due 14 days after they are generated. You'll receive a notification when a new bill is ready.",
  ];
  
  const technicalResponses = [
    "If you're experiencing technical issues, try restarting your device first. If the problem persists, please contact our technical support team.",
    "You can check your data usage in real-time on the Home screen of the app.",
    "To troubleshoot connection issues, make sure you have good signal strength and that your account is active.",
    "If you need to replace your SIM card, you can request one through the app or by calling our customer service.",
    "For router configuration help, please refer to the user manual or contact our technical support team.",
  ];
  
  const generalResponses = [
    "I'm here to help with any questions about CheapDeals services. What would you like to know?",
    "You can manage all aspects of your account through this app, including viewing usage, paying bills, and upgrading packages.",
    "Our customer service team is available Monday to Friday, 8am to 8pm, and Saturday 9am to 5pm.",
    "You can find more information about our company and services on our website at www.cheapdeals.com.",
    "Is there anything else I can help you with today?",
  ];
  
  export const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Check for package-related queries
    if (
      message.includes("package") ||
      message.includes("plan") ||
      message.includes("deal") ||
      message.includes("offer") ||
      message.includes("mobile") ||
      message.includes("broadband") ||
      message.includes("tablet") ||
      message.includes("upgrade") ||
      message.includes("data")
    ) {
      return packageResponses[Math.floor(Math.random() * packageResponses.length)];
    }
    
    // Check for billing-related queries
    if (
      message.includes("bill") ||
      message.includes("payment") ||
      message.includes("pay") ||
      message.includes("charge") ||
      message.includes("cost") ||
      message.includes("price") ||
      message.includes("expensive") ||
      message.includes("discount") ||
      message.includes("credit card")
    ) {
      return billingResponses[Math.floor(Math.random() * billingResponses.length)];
    }
    
    // Check for technical-related queries
    if (
      message.includes("technical") ||
      message.includes("issue") ||
      message.includes("problem") ||
      message.includes("not working") ||
      message.includes("error") ||
      message.includes("help") ||
      message.includes("fix") ||
      message.includes("connection") ||
      message.includes("signal") ||
      message.includes("router") ||
      message.includes("sim")
    ) {
      return technicalResponses[Math.floor(Math.random() * technicalResponses.length)];
    }
    
    // Greetings
    if (
      message.includes("hello") ||
      message.includes("hi") ||
      message.includes("hey") ||
      message.includes("greetings")
    ) {
      return "Hello! How can I assist you today with CheapDeals services?";
    }
    
    // Gratitude
    if (
      message.includes("thank") ||
      message.includes("thanks") ||
      message.includes("appreciate")
    ) {
      return "You're welcome! Is there anything else I can help you with?";
    }
    
    // Goodbye
    if (
      message.includes("bye") ||
      message.includes("goodbye") ||
      message.includes("see you") ||
      message.includes("talk later")
    ) {
      return "Thank you for chatting with CheapDeals assistant. Have a great day!";
    }
    
    // Default response for unrecognized queries
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };