// Add the function to the main menu
function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('🎉 Generate')
        .addItem("Process Sheets 📚", "processSheets")
        .addToUi();
  }
  
  // Function to process all sheets based on a single "Settings" sheet
  function processSheets() {
    var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    var settingsSheet = spreadsheet.getSheetByName("Settings");
    if (!settingsSheet) {
      SpreadsheetApp.getUi().alert("Settings sheet not found!");
      return;
    }
  
    var globalSettings = fetchGlobalSettings(settingsSheet);
    var configurations = fetchSheetConfigurations(settingsSheet);
  
    configurations.forEach(config => {
    if (config.process) { // Only process if the checkbox is checked
        var dataSheet = spreadsheet.getSheetByName(config.dataSheetName);
        if (dataSheet) {
          var settings = { ...globalSettings, ...config }; // Merge global and sheet-specific settings
          processRows(settings, dataSheet);
        } else {
          Logger.log(`Data sheet "${config.dataSheetName}" not found.`);
        }
      }
    });
  }
  
  // Fetch global settings from the "Settings" sheet
  function fetchGlobalSettings(settingsSheet) {
    return {
      openaiApiKey: settingsSheet.getRange("B2").getValue(),
      openaiTemperature: Number(settingsSheet.getRange("B3").getValue()),
      openaiMaxTokens: Number(settingsSheet.getRange("B4").getValue()),
      openaiSystemPrompt: settingsSheet.getRange("B5").getValue(),
      claudeApiKey: settingsSheet.getRange("B6").getValue(),
      claudeTemperature: Number(settingsSheet.getRange("B7").getValue()),
      claudeMaxTokens: Number(settingsSheet.getRange("B8").getValue()),
      claudeSystemPrompt: settingsSheet.getRange("B9").getValue(),
      geminiApiKey: settingsSheet.getRange("B10").getValue(),
      geminiTemperature: Number(settingsSheet.getRange("B11").getValue()),
      geminiMaxTokens: Number(settingsSheet.getRange("B12").getValue()),
      groqApiKey: settingsSheet.getRange("B13").getValue(),
      groqTemperature: Number(settingsSheet.getRange("B14").getValue()),
      groqMaxTokens: Number(settingsSheet.getRange("B15").getValue()),
      groqSystemPrompt: settingsSheet.getRange("B16").getValue(),
      perplexityApiKey: settingsSheet.getRange("B17").getValue(),
      perplexityTemperature: Number(settingsSheet.getRange("B18").getValue()),
      perplexityMaxTokens: Number(settingsSheet.getRange("B19").getValue()),
      perplexitySystemPrompt: settingsSheet.getRange("B20").getValue(),
      grokApiKey: settingsSheet.getRange("B21").getValue(),
      grokTemperature: Number(settingsSheet.getRange("B22").getValue()),
      grokMaxTokens: Number(settingsSheet.getRange("B23").getValue()),
      grokSystemPrompt: settingsSheet.getRange("B24").getValue(),
      deepseekApiKey: settingsSheet.getRange("B25").getValue(),
      deepseekTemperature: Number(settingsSheet.getRange("B26").getValue()),
      deepseekMaxTokens: Number(settingsSheet.getRange("B27").getValue()),
      deepseekSystemPrompt: settingsSheet.getRange("B28").getValue(),
      kimiApiKey: settingsSheet.getRange("B29").getValue(),
      kimiTemperature: Number(settingsSheet.getRange("B30").getValue()),
      kimiMaxTokens: Number(settingsSheet.getRange("B31").getValue()),
      kimiSystemPrompt: settingsSheet.getRange("B32").getValue()
    };
  }
  
  // Fetch configurations for data sheets from the "Settings" sheet
  function fetchSheetConfigurations(settingsSheet) {
    var data = settingsSheet.getRange("A32:H").getValues(); // Range remains A32:H
    var configurations = [];
  
    data.forEach(row => {
      if (row[0]) { // Check if Data Sheet Name exists
        var isProcessEnabled = row[7] === true; // Process checkbox is now in column H (index 7)
        
        configurations.push({
          dataSheetName: row[0],        // Column A (index 0)
          aiEngine: row[1],             // Column B (index 1)
          aiModel: row[2],              // Column C (index 2) - Corrected
          startRow: Number(row[3]),     // Column D (index 3) - Shifted
          endRow: Number(row[4]),       // Column E (index 4) - Shifted
          promptColumns: isProcessEnabled ? row[5].split(',').map(letterToNum) : row[5], // Column F (index 5) - Shifted
          outputColumns: isProcessEnabled ? row[6].split(',').map(letterToNum) : row[6], // Column G (index 6) - Shifted
          process: isProcessEnabled     // Column H (index 7) - Shifted
        });
      }
    });
  
    return configurations;
  }
  
  // Process rows for a given data sheet
  function processRows(settings, dataSheet) {
    // Ensure aiModel exists in settings; if not, log error or use a default? For now, assume it exists.
    if (!settings.aiModel && settings.process) { 
      Logger.log(`AI Model missing for sheet configuration: ${settings.dataSheetName}`);
      // Potentially skip processing or throw an error
      // return; 
    }
  
    for (var i = settings.startRow - 1; i < settings.endRow; i++) {
      for (var j = 0; j < settings.promptColumns.length; j++) {
        var promptColumn = settings.promptColumns[j];
        var outputColumn = settings.outputColumns[j];
        var promptCell = dataSheet.getRange(i + 1, promptColumn);
        var finalPrompt = promptCell.getValue();
  
        if (!finalPrompt.trim()) continue;
  
        var outputCell = dataSheet.getRange(i + 1, outputColumn);
        if (outputCell.getValue() === '') {
          var outputText;
          if (settings.aiEngine === "Gemini") {
              outputText = sendToGeminiPro(finalPrompt, settings.geminiApiKey, settings.aiModel, settings.geminiTemperature, settings.geminiMaxTokens);
          } else if (settings.aiEngine === "OpenAI") {
              if (settings.aiModel.includes("gpt-5")) {
                  outputText = sendToGPT5(finalPrompt, settings.openaiApiKey, settings.aiModel, settings.openaiSystemPrompt);
              } else if (settings.aiModel.includes("o1")) {
                  outputText = sendToO1(finalPrompt, settings.openaiApiKey, settings.aiModel);
              } else if (settings.aiModel.includes("o3")) {
                  outputText = sendToO3(finalPrompt, settings.openaiApiKey, settings.aiModel);
              } else if (settings.aiModel.includes("search")) {
                  outputText = sendToGPTsearch(finalPrompt, settings.openaiApiKey, settings.aiModel);
              } else {
                  outputText = sendToGPT(finalPrompt, settings.openaiApiKey, settings.aiModel, settings.openaiTemperature, settings.openaiMaxTokens, settings.openaiSystemPrompt);
              }
          } else if (settings.aiEngine === "Claude") {
              outputText = sendToClaude(finalPrompt, settings.claudeApiKey, settings.aiModel, settings.claudeTemperature, settings.claudeMaxTokens, settings.claudeSystemPrompt);
          } else if (settings.aiEngine === "GroqCloud") {
              outputText = sendToGroq(finalPrompt, settings.groqApiKey, settings.aiModel, settings.groqTemperature, settings.groqMaxTokens, settings.groqSystemPrompt);
          } else if (settings.aiEngine === "Perplexity") {
              outputText = sendToPerplexity(finalPrompt, settings.perplexityApiKey, settings.aiModel, settings.perplexityTemperature, settings.perplexityMaxTokens, settings.perplexitySystemPrompt);
          } else if (settings.aiEngine === "Grok") {
              outputText = sendToGrok(finalPrompt, settings.grokApiKey, settings.aiModel, settings.grokTemperature, settings.grokMaxTokens, settings.grokSystemPrompt);
          } else if (settings.aiEngine === "DeepSeek") {
              outputText = sendToDeepSeek(finalPrompt, settings.deepseekApiKey, settings.aiModel, settings.deepseekTemperature, settings.deepseekMaxTokens, settings.deepseekSystemPrompt);
          } else if (settings.aiEngine === "Kimi") {
              outputText = sendToKimi(finalPrompt, settings.kimiApiKey, settings.aiModel, settings.kimiTemperature, settings.kimiMaxTokens, settings.kimiSystemPrompt);
          } else {
              outputText = 'Error: Unknown AI engine';
          }
          outputCell.setValue(outputText);
        }
      }
    }
  }
  
  // Function to convert letter to column number
  function letterToNum(letter) {
    if (!letter.trim()) throw new Error('Invalid column letter');
  
    letter = letter.trim().toUpperCase();
    var column = 0, length = letter.length;
    for (var i = 0; i < length; i++) {
      column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
    }
    return column;
  }
  
  // Function to send prompt to Gemini Pro
  function sendToGeminiPro(prompt, apiKey, model, temperature, maxTokens) {
    var endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    var geminiProData = {
      "contents": [
        {
          "parts": [
            {
              "text": prompt
            }
          ]
        }
      ],
      "generationConfig": {
        "temperature": temperature,
        "maxOutputTokens": maxTokens,
        "topP": 0.8,
        "topK": 10,
        "stopSequences": ["Title"]
      },
      "safetySettings": [
        {
          "category": "HARM_CATEGORY_HARASSMENT",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_HATE_SPEECH",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          "threshold": "BLOCK_NONE"
        },
        {
          "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
          "threshold": "BLOCK_NONE"
        }
      ]
    };
  
    var geminiProOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(geminiProData),
      muteHttpExceptions: true
    };
  
    try {
      var response = UrlFetchApp.fetch(endpoint, geminiProOptions);
      var jsonResponse = JSON.parse(response.getContentText());
  
      // Safely extract the response content
      if (jsonResponse && jsonResponse.candidates && jsonResponse.candidates[0].content.parts[0]) {
        return jsonResponse.candidates[0].content.parts[0].text;
      } else {
        Logger.log('Unexpected response structure: ' + response.getContentText());
        return 'Error: Unexpected response structure';
      }
    } catch (error) {
      Logger.log('Error sending to Gemini Pro: ' + error);
      return 'Error: Failed to fetch response from Gemini Pro';
    }
  }

  // 🍓 GPT-5
  function sendToGPT5(prompt, apiKey, model, systemPrompt) {
  const body = {
    model: model,
    input: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
    reasoning: {
      effort: "minimal"
    },
    text: {
      verbosity: "low"
    }
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + apiKey
    },
    payload: JSON.stringify(body)
  };

  const response = UrlFetchApp.fetch("https://api.openai.com/v1/responses", options);
  const data = JSON.parse(response.getContentText());

  // Find the "message" type object in the output array
  const messageObj = data.output.find(o => o.type === "message");

  if (messageObj && messageObj.content && messageObj.content.length > 0) {
    return messageObj.content[0].text || 'No text found in message content';
  } else {
    return 'No message object found in output';
  }
}
  
  // Function to send data to OpenAI GPT
  function sendToGPT(prompt, apiKey, model, temperature, maxTokens, systemPrompt) {
    var gptData = {
      model: model,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
      max_tokens: maxTokens,
      temperature: temperature
    };
    var gptOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(gptData),
      headers: { Authorization: `Bearer ${apiKey}` }
    };
    var response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", gptOptions);
    return JSON.parse(response.getContentText()).choices[0].message.content;
  }
  
  // Function to send data to OpenAI GPT Search Models
  function sendToGPTsearch(prompt, apiKey, model) {
    var gptData = {
      model: model,
      messages: [{ role: "user", content: prompt }],
    };
    var gptOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(gptData),
      headers: { Authorization: `Bearer ${apiKey}` }
    };
    var response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", gptOptions);
    console.log(response.getContentText());
    return JSON.parse(response.getContentText()).choices[0].message.content;
  }
  
  // Function for OpenAI o1 models
  function sendToO1(prompt, apiKey, model) {
    var gptData = {
      model: model,
      messages: [{ role: "user", content: prompt }]
    };
    var gptOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(gptData),
      headers: { Authorization: `Bearer ${apiKey}` }
    };
    var response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", gptOptions);
    return JSON.parse(response.getContentText()).choices[0].message.content;
  }
  
  // Function for OpenAI o3 models
  function sendToO3(prompt, apiKey, model) {
    var gptData = {
      model: model,
      reasoning_effort: 'medium',
      messages: [{ role: "user", content: prompt }]
    };
    var gptOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(gptData),
      headers: { Authorization: `Bearer ${apiKey}` }
    };
    var response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", gptOptions);
    return JSON.parse(response.getContentText()).choices[0].message.content;
  }
  
  // Function to send data to Claude
  function sendToClaude(prompt, apiKey, model, temperature, maxTokens, systemPrompt) {
    var endpoint = 'https://api.anthropic.com/v1/messages';
    var claudeData = {
      model: model,
      temperature: temperature,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: prompt }]
    };
    var claudeOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(claudeData),
      headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" }
    };
    var response = UrlFetchApp.fetch(endpoint, claudeOptions);
    return JSON.parse(response.getContentText()).content[0].text;
  }
  
  // Function to send data to Groq API
  function sendToGroq(prompt, apiKey, model, temperature, maxTokens, systemPrompt) {
    var endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    var groqData = {
      model: model,
      temperature: temperature,
      max_tokens: maxTokens,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }]
    };
    var groqOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(groqData),
      headers: { Authorization: `Bearer ${apiKey}` }
    };
    var response = UrlFetchApp.fetch(endpoint, groqOptions);
    return JSON.parse(response.getContentText()).choices[0].message.content;
  }
  
  // Function to send data to Perplexity API
  function sendToPerplexity(prompt, apiKey, model, temperature, maxTokens, systemPrompt) {
    var endpoint = 'https://api.perplexity.ai/chat/completions';
    var perplexityData = {
      "model": model,
      "messages": [
        {
          "role": "system",
          "content": systemPrompt
        },
        {
          "role": "user",
          "content": prompt
        }
      ],
      "max_tokens": maxTokens || "Optional",
      "temperature": temperature || 0.2,
      "top_p": 0.9,
      "return_images": false,
      "return_related_questions": false,
      "top_k": 0,
      "stream": false,
      "presence_penalty": 0,
      "frequency_penalty": 1
    };
  
    var perplexityOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(perplexityData),
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      muteHttpExceptions: true
    };
  
    try {
      var response = UrlFetchApp.fetch(endpoint, perplexityOptions);
      var jsonResponse = JSON.parse(response.getContentText());
  
      // Extract the assistant's response from the Perplexity API
      if (jsonResponse && jsonResponse.choices && jsonResponse.choices[0].message.content) {
        var content = jsonResponse.choices[0].message.content;
        // Remove citations like [1], [2], etc., and <think> tags using regex
        content = content.replace(/\[\d+\]|<think>.*?<\/think>/gs, "").trim();
        return content;
      } else {
        Logger.log('Unexpected response structure: ' + response.getContentText());
        return 'Error: Unexpected response structure';
      }
    } catch (error) {
      Logger.log('Error sending to Perplexity: ' + error);
      return 'Error: Failed to fetch response from Perplexity';
    }
  }
  
  // Function to send data to Grok API
  function sendToGrok(prompt, apiKey, model, temperature, maxTokens, systemPrompt) {
    var endpoint = 'https://api.x.ai/v1/chat/completions';
    var grokData = {
      model: model,
      temperature: temperature,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ]
    };
    var grokOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(grokData),
      headers: { "Authorization": "Bearer " + apiKey }
    };
    var response = UrlFetchApp.fetch(endpoint, grokOptions);
    return JSON.parse(response.getContentText()).choices[0].message.content;
  }
  
  // Function to send data to DeepSeek API
  function sendToDeepSeek(prompt, apiKey, model, temperature, maxTokens, systemPrompt) {
    var endpoint = 'https://api.deepseek.com/chat/completions';
    var deepSeekData = {
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      model: model,
      frequency_penalty: 0,
      max_tokens: maxTokens,
      presence_penalty: 0,
      response_format: {
        type: "text"
      },
      stop: null,
      stream_options: null,
      temperature: temperature,
      top_p: 1
    };
    var deepSeekOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(deepSeekData),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer " + apiKey
      }
    };
    var response = UrlFetchApp.fetch(endpoint, deepSeekOptions);
    var jsonResponse = JSON.parse(response.getContentText());
    return jsonResponse.choices[0].message.content; // Extract the assistant's response content
  }
  
  // Function to send data to Kimi API (Moonshot Platform)
  function sendToKimi(prompt, apiKey, model, temperature, maxTokens, systemPrompt) {
    var endpoint = 'https://api.moonshot.cn/v1/chat/completions';
    var kimiData = {
      model: model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      temperature: temperature,
      max_tokens: maxTokens,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false
    };
    var kimiOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(kimiData),
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      muteHttpExceptions: true
    };
    
    try {
      var response = UrlFetchApp.fetch(endpoint, kimiOptions);
      var jsonResponse = JSON.parse(response.getContentText());
      
      if (jsonResponse && jsonResponse.choices && jsonResponse.choices[0].message.content) {
        return jsonResponse.choices[0].message.content;
      } else {
        Logger.log('Unexpected Kimi response structure: ' + response.getContentText());
        return 'Error: Unexpected response structure from Kimi';
      }
    } catch (error) {
      Logger.log('Error sending to Kimi: ' + error);
      return 'Error: Failed to fetch response from Kimi';
    }
  }
  
// =KIMI(prompt, [model], [temperature], [maxTokens], [systemPrompt])
function KIMI(prompt, model, temperature, maxTokens, systemPrompt) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = fetchGlobalSettings(ss.getSheetByName('Settings'));
  var mdl = String(model || 'moonshot-v1-8k');
  var temp = (typeof temperature === 'number') ? temperature : (Number(s.kimiTemperature) || 0.2);
  var maxTok = (typeof maxTokens === 'number') ? maxTokens : (Number(s.kimiMaxTokens) || 512);
  var sys = (systemPrompt !== undefined && systemPrompt !== null && systemPrompt !== '') ? systemPrompt : (s.kimiSystemPrompt || '');
  return sendToKimi(String(prompt || ''), s.kimiApiKey, mdl, temp, maxTok, sys);
}

// =CLAUDE(prompt, [model], [temperature], [maxTokens], [systemPrompt])
function CLAUDE(prompt, model, temperature, maxTokens, systemPrompt) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = fetchGlobalSettings(ss.getSheetByName('Settings'));
  var mdl = String(model || 'claude-3-5-sonnet-latest');
  var temp = (typeof temperature === 'number') ? temperature : (Number(s.claudeTemperature) || 0.2);
  var maxTok = (typeof maxTokens === 'number') ? maxTokens : (Number(s.claudeMaxTokens) || 1024);
  var sys = (systemPrompt !== undefined && systemPrompt !== null && systemPrompt !== '') ? systemPrompt : (s.claudeSystemPrompt || '');
  return sendToClaude(String(prompt || ''), s.claudeApiKey, mdl, temp, maxTok, sys);
}

// =GEMINI(prompt, [model], [temperature], [maxTokens])
function GEMINI(prompt, model, temperature, maxTokens) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = fetchGlobalSettings(ss.getSheetByName('Settings'));
  var mdl = String(model || 'gemini-1.5-pro-latest');
  var temp = (typeof temperature === 'number') ? temperature : (Number(s.geminiTemperature) || 0.2);
  var maxTok = (typeof maxTokens === 'number') ? maxTokens : (Number(s.geminiMaxTokens) || 1024);
  return sendToGeminiPro(String(prompt || ''), s.geminiApiKey, mdl, temp, maxTok);
}

// =DEEPSEEK(prompt, [model], [temperature], [maxTokens], [systemPrompt])
function DEEPSEEK(prompt, model, temperature, maxTokens, systemPrompt) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = fetchGlobalSettings(ss.getSheetByName('Settings'));
  var mdl = String(model || 'deepseek-chat');
  var temp = (typeof temperature === 'number') ? temperature : (Number(s.deepseekTemperature) || 0.2);
  var maxTok = (typeof maxTokens === 'number') ? maxTokens : (Number(s.deepseekMaxTokens) || 1024);
  var sys = (systemPrompt !== undefined && systemPrompt !== null && systemPrompt !== '') ? systemPrompt : (s.deepseekSystemPrompt || '');
  return sendToDeepSeek(String(prompt || ''), s.deepseekApiKey, mdl, temp, maxTok, sys);
}
