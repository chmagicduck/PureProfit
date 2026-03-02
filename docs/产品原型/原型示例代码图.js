import React, { useState, useEffect, useMemo } from 'react';
import {
  Home,
  TrendingUp,
  FlaskConical,
  User,
  Zap,
  Target,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  Calendar,
  Clock
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [status, setStatus] = useState('work'); // rest, work, rest_m (白嫖), overtime
  const [totalIncome, setTotalIncome] = useState(132.2044);
  const [moYuIncome, setMoYuIncome] = useState(19.2500);
  const [monthTotal, setMonthTotal] = useState(15843.054);

  // 模拟高频实时收益逻辑
  useEffect(() => {
    const timer = setInterval(() => {
      const baseIncrement = 0.0004; // 基础步长
      setTotalIncome(prev => prev + baseIncrement);
      setMonthTotal(prev => prev + baseIncrement);
      
      // 只有在“白嫖中”状态下，白嫖收益才增长
      if (status === 'rest_m') {
        setMoYuIncome(prev => prev + baseIncrement);
      }
    }, 100);
    return () => clearInterval(timer);
  }, [status]);

  const tabs = [
    { id: 'home', label: '搞钱中心', icon: Home },
    { id: 'report', label: '财富战报', icon: TrendingUp },
    { id: 'lab', label: '实验室', icon: FlaskConical },
    { id: 'me', label: '我的', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FDFEFE] flex justify-center items-start font-sans antialiased">
      {/* 灵动背景光晕 */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[60%] rounded-full bg-yellow-200/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[-5%] w-[50%] h-[50%] rounded-full bg-emerald-100/30 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] min-h-screen md:min-h-[852px] md:my-8 md:rounded-[48px] overflow-hidden flex flex-col relative z-10 border border-slate-100/50">
        
        {/* 1. 顶部状态栏区域 */}
        <div className="px-8 pt-14 pb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-yellow-400 flex items-center justify-center shadow-[0_8px_20px_rgba(249,115,22,0.3)]">
                <Zap className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-[1000] text-slate-900 tracking-tight leading-none">纯利时刻</span>
                <div className="flex items-center space-x-1.5 mt-1.5">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em]">搞钱引擎运行中</span>
                </div>
              </div>
            </div>
            <div className="w-20"></div> {/* 微信胶囊占位 */}
          </div>

          <div className="flex items-center justify-between bg-slate-50/50 backdrop-blur-sm p-3.5 rounded-[24px] border border-white/80 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-slate-400" />
              </div>
              <span className="text-sm font-black text-slate-700">早安，尊贵的打工人</span>
            </div>
            <div className="flex items-center text-[11px] font-black text-slate-400">
              账户设置 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </div>
          </div>
        </div>

        {/* 2. 核心收益显示 - 强化黄金质感 */}
        <div className="px-8 mt-4 text-center relative">
          <div className="inline-flex items-center py-1.5 px-3.5 bg-yellow-400/10 rounded-full border border-yellow-400/20 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-yellow-600 mr-2" />
            <span className="text-yellow-700 text-[11px] font-black tracking-widest uppercase">今日实时纯利总额</span>
          </div>
          
          <div className="relative inline-block mb-10">
             {/* 数字背后的发光层 */}
            <div className="absolute inset-0 bg-yellow-400/25 blur-[50px] rounded-full scale-150"></div>
            <h1 className="relative text-[72px] font-[1000] text-[#F4B400] leading-none tracking-tighter drop-shadow-[0_10px_10px_rgba(244,180,0,0.2)]">
              <span className="text-3xl mr-1 font-black italic">¥</span>
              {totalIncome.toFixed(4)}
            </h1>
          </div>
          
          {/* 收益分项卡片 */}
          <div className="flex justify-center items-center p-6 bg-white/60 backdrop-blur-md rounded-[32px] border border-white shadow-[0_8px_30px_rgb(0,0,0,0.02)] mx-2">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[11px] font-black text-slate-400 mb-1.5">搬砖所得</span>
              <span className="text-lg font-[900] text-slate-800 tracking-tight">¥{(totalIncome - moYuIncome).toFixed(2)}</span>
            </div>
            <div className="h-10 w-[1px] bg-slate-100 mx-4"></div>
            <div className="flex-1 flex flex-col items-center">
              <span className="text-[11px] font-black text-emerald-500 mb-1.5 flex items-center">
                白嫖收益 <div className="ml-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
              </span>
              <span className="text-xl font-[1000] text-emerald-500 tracking-tight">¥{moYuIncome.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* 3. 月度累计 - 深色高级感 */}
        <div className="px-8 mt-8">
          <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-7 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <p className="text-[11px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">本月搞钱累计</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-[1000] text-white tracking-tight">
                    ¥{monthTotal.toLocaleString(undefined, {minimumFractionDigits: 3})}
                  </span>
                </div>
              </div>
              <div className="text-right pb-1">
                <div className="inline-block px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl backdrop-blur-md">
                   <p className="text-[11px] font-black text-emerald-400 leading-none">目标 72.4%</p>
                </div>
              </div>
            </div>
            {/* 渐变进度条 */}
            <div className="mt-6 h-3 w-full bg-white/10 rounded-full overflow-hidden p-[2px]">
              <div className="h-full bg-gradient-to-r from-yellow-400 via-emerald-400 to-emerald-500 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.5)]" style={{ width: '72.4%' }}></div>
            </div>
            <Target className="absolute -right-8 -bottom-8 w-40 h-40 text-white/[0.03] -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>
        </div>

        {/* 4. 搞钱状态药丸 - 物理触感 */}
        <div className="px-8 mt-8">
          <div className="bg-slate-100/80 p-1.5 rounded-[32px] flex items-center shadow-inner border border-white/50">
            {[
              { id: 'rest', label: '充电中', active: 'bg-white text-blue-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)]' },
              { id: 'work', label: '搬砖中', active: 'bg-white text-slate-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)]' },
              { id: 'rest_m', label: '白嫖中', active: 'bg-white text-emerald-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)]' },
              { id: 'overtime', label: '修仙中', active: 'bg-white text-rose-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)]' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setStatus(mode.id)}
                className={`flex-1 py-3.5 rounded-[26px] text-[12px] font-black transition-all duration-300 ${
                  status === mode.id
                  ? `${mode.active} scale-100`
                  : 'text-slate-400 hover:text-slate-500 scale-95 opacity-70'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* 5. 今日进度热力图 */}
        <div className="px-8 mt-8">
          <div className="flex justify-between items-end mb-4">
            <p className="text-[12px] font-black text-slate-800 uppercase tracking-widest">今日搞钱状态热力图</p>
            <button className="text-[11px] font-bold text-blue-500 hover:underline">查看历史记录</button>
          </div>
          <div className="h-7 w-full bg-slate-50 rounded-2xl flex overflow-hidden p-1.5 border border-slate-100 shadow-inner">
            <div className="h-full bg-[#1E293B] rounded-lg shadow-sm" style={{ width: '45%' }}></div>
            <div className="w-1.5 h-full"></div>
            <div className="h-full bg-emerald-500 rounded-lg shadow-sm" style={{ width: '20%' }}></div>
            <div className="w-1.5 h-full"></div>
            <div className="h-full bg-blue-500 rounded-lg shadow-sm" style={{ width: '15%' }}></div>
            <div className="w-1.5 h-full"></div>
            <div className="h-full bg-rose-400 rounded-lg flex-1 shadow-sm"></div>
          </div>
          <div className="flex justify-between mt-4 px-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-[#1E293B]"></div>
              <span className="text-[11px] font-black text-slate-500 uppercase">搬砖 4.2h</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span className="text-[11px] font-black text-slate-500 uppercase">白嫖 1.8h</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-[11px] font-black text-slate-500 uppercase">充电 1.2h</span>
            </div>
          </div>
        </div>

        {/* 6. 倒计时矩阵 */}
        <div className="px-8 mt-9 mb-32 grid grid-cols-2 gap-5">
          <div className="col-span-2 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 p-7 rounded-[40px] border border-orange-100/50 flex justify-between items-center group relative overflow-hidden shadow-sm">
            <div className="flex items-center space-x-5 relative z-10">
              <div className="w-16 h-16 rounded-[24px] bg-slate-900 flex items-center justify-center shadow-xl shadow-slate-200 group-hover:scale-105 transition-transform">
                <ArrowUpRight className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-400 mb-1.5 uppercase tracking-wider">离下班/解放还有</p>
                <p className="text-2xl font-[1000] text-slate-900 tracking-tighter italic font-mono">05:42:18</p>
              </div>
            </div>
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-full border-[3px] border-yellow-400 flex items-center justify-center bg-white shadow-inner">
                 <span className="text-xs font-black text-yellow-600">65%</span>
              </div>
            </div>
          </div>

          <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center space-x-2 mb-3 text-slate-400">
               <Calendar className="w-4 h-4" />
               <span className="text-[11px] font-black uppercase tracking-widest">发薪倒计</span>
             </div>
             <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-[1000] text-slate-800 tracking-tighter">14</span>
                <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">Days</span>
             </div>
          </div>

          <div className="p-6 bg-emerald-50 rounded-[32px] border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center space-x-2 mb-3 text-emerald-600">
               <Clock className="w-4 h-4" />
               <span className="text-[11px] font-black uppercase tracking-widest">周末进度</span>
             </div>
             <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-[1000] text-emerald-600 tracking-tighter leading-none">今日即解放</span>
             </div>
          </div>
        </div>

        {/* 底部悬浮毛玻璃导航 */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-sm h-22 bg-white/70 backdrop-blur-3xl rounded-[40px] border border-white/50 shadow-[0_20px_50px_rgba(0,0,0,0.12)] flex items-center justify-around px-8 py-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex flex-col items-center group flex-1"
              >
                <div className={`transition-all duration-500 ease-out ${isActive ? 'scale-125 -translate-y-2 text-slate-900' : 'text-slate-300 hover:text-slate-400'}`}>
                  <Icon className="w-6 h-6" strokeWidth={isActive ? 3 : 2} />
                </div>
                <span className={`text-[10px] font-black mt-1.5 tracking-tight transition-all duration-300 ${isActive ? 'opacity-100 transform translate-y-0' : 'opacity-40 transform translate-y-1'}`}>
                  {tab.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-3 w-1.5 h-1.5 bg-yellow-400 rounded-full shadow-[0_0_12px_rgba(250,204,21,1)]"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;