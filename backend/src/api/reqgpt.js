const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const getResponseData = async (promptText) => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4-0613",
      messages: [{role: "user", content: promptText}],
    });
    return completion.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
  }
};

module.exports = getResponseData;
