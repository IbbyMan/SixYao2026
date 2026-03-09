import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';

const Coin = ({ isFlipping, value, index, tossCount }: { isFlipping: boolean; value: number; index: number; tossCount: number }) => {
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    if (!isFlipping && value) {
      setShowParticles(true);
      const timer = setTimeout(() => setShowParticles(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isFlipping, value]);

  const particles = Array.from({ length: 12 }).map((_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const distance = 50 + Math.random() * 30;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      scale: Math.random() * 0.6 + 0.4,
    };
  });

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 perspective-1000">
      {/* Particles */}
      {showParticles && particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
          animate={{ opacity: 0, x: p.x, y: p.y, scale: p.scale }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-[#8B0000] -translate-x-1/2 -translate-y-1/2 z-0"
        />
      ))}

      {/* Shadow */}
      <motion.div
        animate={
          isFlipping
            ? { scale: [1, 0.5, 1], opacity: [0.4, 0.1, 0.4] }
            : { scale: 1, opacity: 0.4 }
        }
        transition={{ duration: 1.2, ease: "easeInOut", delay: isFlipping ? index * 0.05 : 0 }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/30 rounded-full blur-md"
      />

      <motion.div
        animate={{
          rotateX: tossCount * 1080 + (value === 3 ? 0 : 180),
          rotateZ: tossCount * 360,
          y: isFlipping ? [0, -120, 0] : 0,
          scale: isFlipping ? [1, 1.1, 1] : 1
        }}
        transition={{ 
          duration: 1.2, 
          ease: "easeInOut",
          delay: isFlipping ? index * 0.05 : 0
        }}
        className="w-full h-full relative preserve-3d z-10"
      >
        {/* Front (Yang / 3) - Manchu script side */}
        <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-[#b88a5a] to-[#6b4a3a] border-[3px] border-[#4a3323] flex items-center justify-center backface-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.4)]">
          <div className="w-[28%] h-[28%] bg-[#F4F4EE] border-[3px] border-[#4a3323] absolute shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]" />
          <span className="text-[#2a1d11] font-bold text-xl absolute left-2 opacity-90 drop-shadow-sm">宝</span>
          <span className="text-[#2a1d11] font-bold text-xl absolute right-2 opacity-90 drop-shadow-sm">泉</span>
          <div className="absolute inset-0 rounded-full bg-yellow-500/10 mix-blend-overlay" />
        </div>
        {/* Back (Yin / 2) - Chinese characters side */}
        <div className="absolute w-full h-full rounded-full bg-gradient-to-br from-[#9c754d] to-[#52392d] border-[3px] border-[#3a2818] flex items-center justify-center backface-hidden rotate-x-180 shadow-[inset_0_0_20px_rgba(0,0,0,0.6),0_10px_20px_rgba(0,0,0,0.4)]">
          <div className="w-[28%] h-[28%] bg-[#F4F4EE] border-[3px] border-[#3a2818] absolute shadow-[inset_0_0_8px_rgba(0,0,0,0.6)]" />
          <span className="text-[#1a120a] font-bold text-lg absolute top-1 opacity-90 drop-shadow-sm">乾</span>
          <span className="text-[#1a120a] font-bold text-lg absolute bottom-1 opacity-90 drop-shadow-sm">隆</span>
          <span className="text-[#1a120a] font-bold text-lg absolute left-1 opacity-90 drop-shadow-sm">通</span>
          <span className="text-[#1a120a] font-bold text-lg absolute right-1 opacity-90 drop-shadow-sm">宝</span>
          <div className="absolute inset-0 rounded-full bg-black/10 mix-blend-overlay" />
        </div>
      </motion.div>
    </div>
  );
};

const getLineName = (value: number) => {
  switch (value) {
    case 6: return '老阴';
    case 7: return '少阳';
    case 8: return '少阴';
    case 9: return '老阳';
    default: return '';
  }
};

const HexagramLine = ({ value, index }: { value: number; index: number }) => {
  const isYang = value === 7 || value === 9;
  const isChanging = value === 6 || value === 9;
  const name = getLineName(value);

  // 动爻用暗红色，静爻用深灰/茶色
  const lineColor = isChanging ? 'bg-[#8B0000]/80' : 'bg-[#5C5C53]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center w-full my-3.5"
    >
      <span className="text-[#A3A398] w-8 text-right mr-8 text-sm font-light">{index}</span>
      
      <div className="w-28 h-[10px] flex items-center justify-center relative">
        {isYang ? (
          <div className={`w-full h-full rounded-[1px] ${lineColor} shadow-sm`} />
        ) : (
          <div className="w-full h-full flex justify-between">
            <div className={`w-[44%] h-full rounded-[1px] ${lineColor} shadow-sm`} />
            <div className={`w-[44%] h-full rounded-[1px] ${lineColor} shadow-sm`} />
          </div>
        )}
        {isChanging && (
          <div className="absolute text-[#8B0000] text-[10px] -right-6 opacity-60">✕</div>
        )}
      </div>

      <span className="text-[#A3A398] w-12 text-left ml-8 text-sm font-light tracking-widest">{name}</span>
    </motion.div>
  );
};

export default function App() {
  const [question, setQuestion] = useState('');
  const [isTossing, setIsTossing] = useState(false);
  const [tosses, setTosses] = useState<number[]>([]);
  const [currentCoins, setCurrentCoins] = useState<number[]>([3, 3, 3]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState('');
  const [tossCount, setTossCount] = useState(0);

  const startDivination = async () => {
    if (!question.trim()) return;
    setTosses([]);
    setResult('');
    setTossCount(0);
    setIsTossing(true);

    let currentTosses: number[] = [];
    for (let i = 0; i < 6; i++) {
      // 1. Determine the outcome first
      const c1 = Math.random() > 0.5 ? 3 : 2;
      const c2 = Math.random() > 0.5 ? 3 : 2;
      const c3 = Math.random() > 0.5 ? 3 : 2;
      
      // 2. Set the coins to trigger the flip animation towards the new target
      setCurrentCoins([c1, c2, c3]);
      setTossCount(i + 1);
      setIsFlipping(true);
      
      // 3. Wait for the flip animation to complete
      await new Promise(r => setTimeout(r, 1200));
      
      // 4. Stop flipping, the coins will rest on their target side
      setIsFlipping(false);

      const sum = c1 + c2 + c3;
      currentTosses = [...currentTosses, sum];
      setTosses(currentTosses);

      // 5. Wait before the next toss
      await new Promise(r => setTimeout(r, 800));
    }

    setIsTossing(false);
    generateReading(currentTosses);
  };

  /**
   * 生成占卜解读的函数
   * 调用 DeepSeek API 来分析卦象并生成解读
   * @param finalTosses - 6次掷硬币的结果数组
   */
  const generateReading = async (finalTosses: number[]) => {
    setIsGenerating(true);
    try {
      const prompt = `
# 角色设定
你是一位传承千年的专业六爻预测大师，精通纳甲筮法、六亲世应、旺衰生克与流年太岁。2026年为丙午马年，流年火旺，这是本次占卜的重要时空背景。你只基于用户提供的"占卜语句"和"随机生成的卦象"进行解读，不做任何超自然的绝对化承诺，仅提供决策参考。

# 卦象输入
用户占卜的问题：【${question}】
掷硬币结果（从初爻到上爻，6为老阴，7为少阳，8为少阴，9为老阳）：
${finalTosses.join(', ')}

请你作为专业大师，首先根据上述掷硬币结果，自行推算出本卦、变卦、爻变情况、世爻位置、应爻位置、用神及其状态。
然后，严格按照以下流程和格式输出占卜结果。

# 占卜分析流程（严格遵守）
1. **断事定纲**：首先复述用户的"确定判断句"，明确求测的核心事项（如：事业升迁、项目落地、比赛胜负）。
2. **取用定星**：说明你选取了哪一个"六亲"作为用神，并解释为何如此选取（这是六爻的逻辑核心）。
3. **旺衰审势**：结合2026丙午年（火旺）的流年能量，判断世爻（求测者）与用神（所求之事）的旺衰状态。
4. **动静析变**：分析动爻、变爻对用神的生助或克制作用，这是事情发展的"变数"。
5. **爻辞点睛**：根据核心爻位（世爻、动爻、用神所在爻）的爻辞，先给出一句总断结语，再展开详细解读。
6. **综合断语**：给出一个清晰、明确、唯一、不模棱两可的结论，禁止正反两面都解释、禁止模糊摇摆表述，只给出偏向性明确的判断。

# 语言风格要求
- **专业且通俗**：使用标准的六爻术语（世应、用神、生克、旺衰、爻辞、卦辞），但必须用括号或白话解释其含义，让非专业用户能看懂。
- **结论明确**：杜绝模棱两可、正反都能圆的表述，只给出唯一、确定、偏向清晰的结论，如：顺利、有利、可成、阻力大、难成、需谨慎等，不使用"吉多凶少、可能好可能坏"这类模糊表达。
- **结构清晰**：严格按照"爻辞结语 → 核心结论 → 卦理分析 → 流年建议"的三段式呈现。

# 禁忌
- 禁止涉及封建迷信中的低俗、恐怖内容。
- 禁止对健康、生死等重大事项做出具体诊断式结论（需引导就医）。
- 禁止输出模糊、辩证、正反都可解释的结论。
- 爻辞提取需严格遵循通行本《周易》六十四卦爻辞，禁止随意篡改、编造爻辞；无对应爻辞的爻位，标注"无"。
- 始终在结尾强调："卦象反映的是当下的心理状态与能量趋势，命运掌握在自己手中，此分析仅供决策参考。"

# 输出模板（请严格按照此格式输出）
### 【六爻排盘信息】
- 本卦：[上卦名][下卦名][本卦卦名]（例如：天风姤）
- 变卦：[上卦名][下卦名][变卦卦名]（若无变爻则写"无"）
- 爻变情况：[例如：初九、九五变爻，共2爻]
- 世爻位置：[如：世在二爻]
- 应爻位置：[如：应在五爻]
- 用神：[根据占卜语句确定的六亲，如：父母爻、妻财爻]
- 核心爻位及爻辞：[优先选取世爻、动爻、用神所在爻，如：世爻初九・潜龙勿用；无对应爻辞则写"无"]

### 【爻辞结语】
[用一句简短、古典、有气势的话，总结爻辞含义，作为开头总断]

### 【六爻占卜结果】
**核心结论**：[一句话给出唯一、明确、确定性强的结果，不模棱两可]

### 【卦象深度解析】
1. **求测事项**：[复述并拆解用户的判断句]
2. **用神选取**：[明确用神六亲及理由]
3. **卦理分析**：
   - 世应关系：[世爻与应爻的生克解读]
   - 旺衰判断：[结合丙午马年，分析用神旺衰]
   - 动变玄机：[动爻带来的影响]
4. **爻辞解读**：[结合核心爻位的爻辞，用白话释义，关联求测事项与2026丙午马年能量，支撑核心结论]

### 【大师建议】
[结合卦象、爻辞含义，给出3条具体、可执行的建议，需关联2026年的时间节点或五行属性]

### 【重要提示】
卦象反映的是当下的能量趋势与潜在变数，并非绝对宿命。事在人为，你的每一次努力和正确决策，都在改写未来的轨迹。卦象反映的是当下的心理状态与能量趋势，命运掌握在自己手中，此分析仅供决策参考。
      `;

      // 调用 DeepSeek API（使用 OpenAI 兼容接口）
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          stream: true, // 启用流式响应
        }),
      });

      if (!response.ok) {
        throw new Error(`API 请求失败: ${response.status}`);
      }

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // 解析流式数据
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const json = JSON.parse(data);
                const text = json.choices[0]?.delta?.content || '';
                fullText += text;
                setResult(fullText);
              } catch (e) {
                // 忽略解析错误
              }
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setResult('占卜过程中出现了一些扰动，请稍后再试。');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F4EE] text-[#333333] font-serif selection:bg-[#E5E5DF] selection:text-[#111111]">
      {/* Idle State */}
      {!isTossing && tosses.length === 0 && !result && !isGenerating && (
        <div className="flex flex-col items-center justify-center min-h-screen pt-10 pb-20">
          <div className="mb-16 text-center">
            {/* Logo */}
            <div className="mb-8">
              <img 
                src="/logo.png" 
                alt="六爻请回答2026 Logo" 
                className="w-24 h-24 md:w-32 md:h-32 mx-auto object-contain"
              />
            </div>
            <h1 className="text-3xl md:text-4xl tracking-[0.15em] font-normal text-[#111111] flex items-center justify-center">
              请回答 <span className="font-['Playfair_Display'] ml-3 text-[1.1em] tracking-widest font-medium">2026</span>
              <span className="mx-4 text-[#8B0000] font-light opacity-50">|</span> 
              六爻
            </h1>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-10 px-6"
          >
            <div className="text-center">
              <div className="text-[#A3A398] text-xs tracking-[0.2em] mb-6">占卜问题</div>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full bg-transparent border-b border-[#D5D5CF] pb-4 text-center text-lg md:text-xl focus:outline-none focus:border-[#8B0000] transition-colors resize-none h-20 placeholder:text-[#BDBDB5] placeholder:text-sm md:placeholder:text-base placeholder:font-light leading-relaxed"
                placeholder="请输入一个判断句，如：我今天应该去赴约"
              />
            </div>
            <button
              onClick={startDivination}
              disabled={!question.trim()}
              className="w-full py-4 mt-6 border border-[#333333] text-[#333333] hover:bg-[#333333] hover:text-[#F4F4EE] transition-all duration-300 tracking-[0.2em] text-base disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#333333]"
            >
              开始占卜
            </button>
          </motion.div>
        </div>
      )}

      {/* Tossing State */}
      {(isTossing || (tosses.length > 0 && !result && !isGenerating)) && (
        <div className="flex flex-col items-center w-full min-h-screen">
          {/* Header */}
          <div className="w-full bg-[#F4F4EE] py-8 flex flex-col items-center border-b border-[#E5E5DF] sticky top-0 z-10">
            <h1 className="text-3xl tracking-[0.2em] mb-4 font-light">正在占卜</h1>
            <p className="text-[#A3A398] text-sm tracking-widest">
              第 {tosses.length + 1 > 6 ? 6 : tosses.length + 1} 爻 / 共 6 爻 · 自动模式
            </p>
          </div>

          <div className="w-full max-w-lg px-6 py-12 flex flex-col items-center flex-grow">
            {/* Question */}
            <div className="text-center mb-16">
              <div className="text-[#A3A398] text-sm tracking-widest mb-4">占卜问题</div>
              <h2 className="text-2xl md:text-3xl">{question}</h2>
            </div>

            {/* Hexagram Progress */}
            <div className="w-full flex flex-col items-center mb-20 min-h-[240px]">
              <div className="text-[#A3A398] text-sm tracking-widest mb-8">已成爻象 {tosses.length}/6</div>
              <div className="flex flex-col-reverse w-full">
                {tosses.map((toss, i) => (
                  <HexagramLine key={i} value={toss} index={i + 1} />
                ))}
              </div>
            </div>

            {/* Coins */}
            {tosses.length < 6 && (
              <div className="flex flex-col items-center mt-auto pb-10">
                <div className="flex space-x-6 sm:space-x-8 mb-10">
                  <Coin isFlipping={isFlipping} value={currentCoins[0]} index={0} tossCount={tossCount} />
                  <Coin isFlipping={isFlipping} value={currentCoins[1]} index={1} tossCount={tossCount} />
                  <Coin isFlipping={isFlipping} value={currentCoins[2]} index={2} tossCount={tossCount} />
                </div>
                <div className="text-center">
                  <div className="text-[#A3A398] text-sm tracking-widest mb-4">本次结果</div>
                  <div className="flex space-x-6 text-xl text-[#A3A398]">
                    <span className={currentCoins[0] === 3 ? 'text-[#333333]' : ''}>{currentCoins[0] === 3 ? '正' : '反'}</span>
                    <span className={currentCoins[1] === 3 ? 'text-[#333333]' : ''}>{currentCoins[1] === 3 ? '正' : '反'}</span>
                    <span className={currentCoins[2] === 3 ? 'text-[#333333]' : ''}>{currentCoins[2] === 3 ? '正' : '反'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generating State */}
      {isGenerating && !result && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-10 h-10 border-2 border-[#333333] border-t-transparent rounded-full animate-spin mb-8"></div>
          <p className="text-[#A3A398] tracking-[0.2em] animate-pulse text-lg">大师正在解卦...</p>
        </div>
      )}

      {/* Result State */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl px-6 py-16 mx-auto"
        >
          <div className="text-center mb-16 border-b border-[#E5E5DF] pb-16">
            {/* Logo */}
            <div className="mb-8">
              <img 
                src="/logo.png" 
                alt="六爻请回答2026 Logo" 
                className="w-20 h-20 md:w-24 md:h-24 mx-auto object-contain"
              />
            </div>
            <div className="text-[#A3A398] text-sm tracking-widest mb-6">占卜问题</div>
            <h2 className="text-3xl mb-12">{question}</h2>
            
            <div className="flex flex-col-reverse items-center w-full max-w-xs mx-auto">
              {tosses.map((toss, i) => (
                <HexagramLine key={i} value={toss} index={i + 1} />
              ))}
            </div>
          </div>

          <div className="markdown-body">
            <ReactMarkdown>{result}</ReactMarkdown>
          </div>

          <div className="mt-20 flex justify-center pb-10">
            <button
              onClick={() => {
                setTosses([]);
                setResult('');
                setQuestion('');
              }}
              className="px-16 py-4 border border-[#333333] text-[#333333] hover:bg-[#333333] hover:text-[#F4F4EE] transition-colors tracking-[0.2em] text-lg"
            >
              再次占卜
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
