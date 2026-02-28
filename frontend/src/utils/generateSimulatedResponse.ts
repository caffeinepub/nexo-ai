import { detectLanguage } from './detectLanguage';

const textResponses: Record<string, string[]> = {
  en: [
    "That's a fascinating question! Let me think through this carefully. Based on my analysis, there are several key aspects to consider here. The topic you've raised touches on fundamental principles that have been studied extensively. I'd be happy to explore this further with you.",
    "Great point! I've processed your message and here's my comprehensive response. This is indeed a nuanced topic with multiple dimensions. Let me break it down for you in a clear and structured way.",
    "I understand what you're asking. This is a complex subject that requires careful consideration. Here's my analysis: the core concepts involved are interconnected in interesting ways. I'll walk you through the key insights.",
    "Excellent question! Based on my knowledge, I can provide you with a detailed explanation. The subject matter you've brought up is both important and timely. Let me share some key perspectives on this.",
    "I've analyzed your input thoroughly. This topic has several interesting facets worth exploring. My response draws from a broad understanding of the subject, and I'm confident this will be helpful to you.",
  ],
  ar: [
    "سؤال رائع! دعني أفكر في هذا بعناية. بناءً على تحليلي، هناك عدة جوانب رئيسية يجب مراعاتها. الموضوع الذي طرحته يمس مبادئ أساسية تمت دراستها على نطاق واسع.",
    "نقطة ممتازة! لقد عالجت رسالتك وإليك ردي الشامل. هذا موضوع دقيق بالفعل له أبعاد متعددة. دعني أشرحه لك بطريقة واضحة ومنظمة.",
  ],
  zh: [
    "这是一个很好的问题！让我仔细思考一下。根据我的分析，这里有几个关键方面需要考虑。您提出的话题涉及到已被广泛研究的基本原则。",
    "很好的观点！我已经处理了您的消息，这是我的全面回应。这确实是一个具有多个维度的微妙话题。让我以清晰有条理的方式为您分解。",
  ],
  ja: [
    "素晴らしい質問ですね！慎重に考えてみましょう。私の分析によると、ここで考慮すべきいくつかの重要な側面があります。あなたが提起したトピックは、広く研究されてきた基本的な原則に触れています。",
  ],
  ko: [
    "훌륭한 질문입니다! 신중하게 생각해 보겠습니다. 제 분석에 따르면, 여기서 고려해야 할 몇 가지 핵심 측면이 있습니다. 당신이 제기한 주제는 광범위하게 연구된 기본 원칙에 닿아 있습니다.",
  ],
  hi: [
    "यह एक बेहतरीन सवाल है! मुझे इसे ध्यान से सोचने दें। मेरे विश्लेषण के आधार पर, यहाँ विचार करने के लिए कई प्रमुख पहलू हैं। आपने जो विषय उठाया है वह मूलभूत सिद्धांतों को छूता है।",
  ],
  ru: [
    "Отличный вопрос! Позвольте мне тщательно обдумать это. На основе моего анализа, здесь есть несколько ключевых аспектов для рассмотрения. Тема, которую вы подняли, касается фундаментальных принципов.",
  ],
  es: [
    "¡Excelente pregunta! Déjame pensar en esto cuidadosamente. Según mi análisis, hay varios aspectos clave a considerar aquí. El tema que has planteado toca principios fundamentales que han sido ampliamente estudiados.",
  ],
  fr: [
    "Excellente question ! Laissez-moi réfléchir à cela attentivement. D'après mon analyse, il y a plusieurs aspects clés à considérer ici. Le sujet que vous avez soulevé touche à des principes fondamentaux qui ont été largement étudiés.",
  ],
  de: [
    "Ausgezeichnete Frage! Lassen Sie mich das sorgfältig durchdenken. Basierend auf meiner Analyse gibt es hier mehrere wichtige Aspekte zu berücksichtigen. Das Thema, das Sie angesprochen haben, berührt grundlegende Prinzipien.",
  ],
};

const imageResponses: Record<string, string> = {
  en: "✨ Image generated successfully! I've created a visual representation based on your prompt. The image captures the essence of your description with vivid detail and artistic composition.",
  ar: "✨ تم إنشاء الصورة بنجاح! لقد أنشأت تمثيلاً مرئياً بناءً على طلبك.",
  zh: "✨ 图像生成成功！我根据您的提示创建了一个视觉表示。",
  ja: "✨ 画像が正常に生成されました！あなたのプロンプトに基づいてビジュアル表現を作成しました。",
  ko: "✨ 이미지가 성공적으로 생성되었습니다! 프롬프트를 기반으로 시각적 표현을 만들었습니다.",
  hi: "✨ छवि सफलतापूर्वक बनाई गई! मैंने आपके प्रॉम्प्ट के आधार पर एक दृश्य प्रतिनिधित्व बनाया है।",
  ru: "✨ Изображение успешно создано! Я создал визуальное представление на основе вашего запроса.",
  es: "✨ ¡Imagen generada con éxito! He creado una representación visual basada en tu descripción.",
  fr: "✨ Image générée avec succès ! J'ai créé une représentation visuelle basée sur votre description.",
  de: "✨ Bild erfolgreich generiert! Ich habe eine visuelle Darstellung basierend auf Ihrer Beschreibung erstellt.",
};

const videoResponses: Record<string, string> = {
  en: "🎬 Video generated successfully! I've created an animated sequence based on your prompt. The video showcases dynamic motion and visual storytelling that brings your concept to life.",
  ar: "🎬 تم إنشاء الفيديو بنجاح! لقد أنشأت تسلسلاً متحركاً بناءً على طلبك.",
  zh: "🎬 视频生成成功！我根据您的提示创建了一个动画序列。",
  ja: "🎬 動画が正常に生成されました！あなたのプロンプトに基づいてアニメーションシーケンスを作成しました。",
  ko: "🎬 비디오가 성공적으로 생성되었습니다! 프롬프트를 기반으로 애니메이션 시퀀스를 만들었습니다.",
  hi: "🎬 वीडियो सफलतापूर्वक बनाया गया! मैंने आपके प्रॉम्प्ट के आधार पर एक एनिमेटेड अनुक्रम बनाया है।",
  ru: "🎬 Видео успешно создано! Я создал анимированную последовательность на основе вашего запроса.",
  es: "🎬 ¡Video generado con éxito! He creado una secuencia animada basada en tu descripción.",
  fr: "🎬 Vidéo générée avec succès ! J'ai créé une séquence animée basée sur votre description.",
  de: "🎬 Video erfolgreich generiert! Ich habe eine animierte Sequenz basierend auf Ihrer Beschreibung erstellt.",
};

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateSimulatedResponse(
  userText: string,
  mode: 'text' | 'image' | 'video'
): string {
  const lang = detectLanguage(userText);
  const code = lang.code;

  if (mode === 'image') {
    return imageResponses[code] || imageResponses['en'];
  }

  if (mode === 'video') {
    return videoResponses[code] || videoResponses['en'];
  }

  // Text mode
  const responses = textResponses[code] || textResponses['en'];
  const base = getRandomItem(responses);

  // Add language acknowledgment for non-English
  if (code !== 'en') {
    const ackMap: Record<string, string> = {
      ar: `[Responding in ${lang.name}] `,
      zh: `[以${lang.name}回复] `,
      ja: `[${lang.name}で返答] `,
      ko: `[${lang.name}로 응답] `,
      hi: `[${lang.name} में उत्तर] `,
      ru: `[Отвечаю на ${lang.name}] `,
      es: `[Respondiendo en ${lang.name}] `,
      fr: `[Répondant en ${lang.name}] `,
      de: `[Antwort auf ${lang.name}] `,
      he: `[מגיב ב${lang.name}] `,
      fa: `[پاسخ به ${lang.name}] `,
      th: `[ตอบเป็น${lang.name}] `,
      el: `[Απαντώ στα ${lang.name}] `,
      pt: `[Respondendo em ${lang.name}] `,
    };
    return (ackMap[code] || `[Responding in ${lang.name}] `) + base;
  }

  return base;
}
