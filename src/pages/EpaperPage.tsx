import React, { useState, useEffect } from 'react';
import { Newspaper, ZoomIn, ZoomOut, Calendar, Download, Printer, Share2, Eye } from 'lucide-react';
import { epapersService } from '../services/epapers';

export const EpaperPage: React.FC = () => {
  const [selectedEdition, setSelectedEdition] = useState('भोपाल');
  const [selectedPage, setSelectedPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [realEpapers, setRealEpapers] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any>(null);
  useEffect(()=>{
    epapersService.list({ status:'published' }).then(setRealEpapers).catch(()=>{});
    epapersService.getFeatured().then(setFeatured).catch(()=>{});
  },[]);

  const pagesInfo = [
    { num: 1, title: 'मुखपृष्ठ • देश-विदेश', lead: 'मोदी ने चित्रकूट धाम में विकास योजनाओं का लोकार्पण किया — ₹4500 करोड़ की सौगात' },
    { num: 2, title: 'प्रदेश • भोपाल समाचार', lead: 'भोपाल में मेट्रो ट्रायल सफल, दिसंबर से व्यावसायिक संचालन' },
    { num: 3, title: 'धर्म • चित्रकूट ज्योति', lead: 'कामदगिरि परिक्रमा में उमड़ा आस्था का जनसैलाब' },
    { num: 4, title: 'संपादकीय • विचार', lead: 'सकारात्मक पत्रकारिता ही लोकतंत्र की शक्ति' },
    { num: 5, title: 'खेल • क्रिकेट', lead: 'भारत ने ऑस्ट्रेलिया को 84 रन से हराया, सीरीज 3-1' },
    { num: 6, title: 'मनोरंजन • लाइफस्टाइल', lead: 'बॉलीवुड में मप्र की लोककला की धूम' },
    { num: 7, title: 'टेक • भविष्य जिज्ञासा', lead: 'आज का राशिफल एवं पंचांग — शनिवार विशेष' },
    { num: 8, title: 'विज्ञापन • वर्गीकृत', lead: 'भोपाल, सतना, रीवा के विज्ञापन' },
  ];

  const totalPages = pagesInfo.length;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4">
      {/* Real E-Papers from Admin (DB) */}
      {realEpapers.length > 0 && (
        <div className="mb-6 bg-white dark:bg-slate-900 rounded-2xl border p-4 sm:p-5">
          <h2 className="font-black text-sm mb-3 flex items-center gap-2"><Newspaper className="w-4 h-4 text-[#8B0000]" /> आज का ई-पेपर — एडमिन द्वारा प्रकाशित ({realEpapers.length})</h2>
          {featured && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row gap-3 items-start">
              <img src={featured.cover_public_url || 'https://placehold.co/120x160'} alt="" className="w-24 h-32 object-cover rounded border shadow" />
              <div className="flex-1">
                <span className="bg-[#8B0000] text-white text-[10px] font-black px-2 py-1 rounded">⭐ FEATURED • {featured.edition_date}</span>
                <h3 className="font-bold mt-1">{featured.title}</h3>
                <p className="text-xs text-slate-600">{featured.description || 'आज का मुख्य संस्करण — भोपाल'}</p>
                <div className="flex gap-2 mt-2">
                  {featured.pdf_public_url && <a href={featured.pdf_public_url} target="_blank" className="px-4 py-2 bg-[#8B0000] text-white rounded-full text-xs font-black inline-flex items-center gap-1"><Eye className="w-4 h-4" /> Read Now</a>}
                  {featured.pdf_public_url && <a href={featured.pdf_public_url} download className="px-4 py-2 bg-white border rounded-full text-xs font-bold inline-flex items-center gap-1"><Download className="w-4 h-4" /> Download PDF</a>}
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {realEpapers.map((e:any)=>(
              <div key={e.id} className="bg-slate-50 rounded-xl border overflow-hidden">
                <img src={e.cover_public_url || 'https://placehold.co/120x160'} alt="" className="w-full h-32 object-cover" />
                <div className="p-2">
                  <p className="font-bold text-xs line-clamp-1">{e.title}</p>
                  <p className="text-[11px] text-slate-500">{e.edition_date} • {e.edition_type}</p>
                  <div className="flex gap-1 mt-1">
                    {e.pdf_public_url && <a href={e.pdf_public_url} target="_blank" className="text-[11px] bg-[#8B0000] text-white px-2 py-1 rounded-full font-bold">Read</a>}
                    {e.pdf_public_url && <a href={e.pdf_public_url} download className="text-[11px] bg-white border px-2 py-1 rounded-full">PDF</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">↑ ये एडमिन पैनल `/admin/epaper` से प्रकाशित असली PDFs हैं — डाउनलोड/रीड में वही फाइल खुलेगी।</p>
          {featured?.pdf_public_url && (
            <div className="mt-4 border rounded-xl overflow-hidden bg-slate-100">
              <p className="text-xs font-black p-2 bg-white border-b">📖 Featured PDF Reader — {featured.title}</p>
              <iframe src={featured.pdf_public_url} title="E-Paper PDF" className="w-full h-[600px] bg-white" />
            </div>
          )}
        </div>
      )}
      {/* Controls */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border shadow-sm mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-[#8B0000]" />
          <span className="font-bold font-devanagari">संस्करण:</span>
          <select value={selectedEdition} onChange={e=>setSelectedEdition(e.target.value)} className="bg-slate-100 dark:bg-slate-800 font-bold border rounded px-2 py-1 text-sm">
            <option value="भोपाल">भोपाल (मुख्य)</option>
            <option value="इंदौर">इंदौर</option>
            <option value="जबलपुर">जबलपुर</option>
            <option value="ग्वालियर">ग्वालियर</option>
            <option value="चित्रकूट">चित्रकूट</option>
            <option value="रीवा">रीवा</option>
          </select>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4 text-[#8B0000]" />
          <span className="font-bold font-devanagari">शनिवार, 30 अगस्त 2026</span>
          <span className="hidden sm:inline bg-[#8B0000] text-white px-2 py-0.5 rounded text-[10px]">मूल्य ₹4.00 • 8 पृष्ठ</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setZoomLevel(z=>Math.max(70,z-15))} className="p-1.5 rounded bg-slate-100 border"><ZoomOut className="w-4 h-4" /></button>
          <span className="font-mono font-bold w-10 text-center">{zoomLevel}%</span>
          <button onClick={()=>setZoomLevel(z=>Math.min(150,z+15))} className="p-1.5 rounded bg-slate-100 border"><ZoomIn className="w-4 h-4" /></button>
          <button className="hidden sm:flex bg-[#8B0000] text-white font-bold px-3 py-1.5 rounded items-center gap-1"><Download className="w-3.5 h-3.5" /> PDF डाउनलोड</button>
        </div>
      </div>

      {/* Page tabs */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-4 border-b">
        {pagesInfo.map(p=>(
          <button key={p.num} onClick={()=>setSelectedPage(p.num)} className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border font-devanagari ${selectedPage===p.num ? 'bg-[#8B0000] text-white border-[#8B0000]' : 'bg-white border-slate-200 hover:bg-amber-50'}`}>पृष्ठ {p.num}: {p.title.split('•')[0]}</button>
        ))}
      </div>

      {/* Newspaper Replica */}
      <div className="bg-stone-200 dark:bg-slate-950 p-2 sm:p-6 rounded-2xl overflow-auto border shadow-inner flex justify-center">
        <div style={{ transform:`scale(${zoomLevel/100})`, transformOrigin:'top center' }} className="bg-[#fffef7] text-[#111] w-[820px] min-h-[1100px] p-5 sm:p-7 border-[6px] border-black shadow-2xl flex flex-col font-devanagari transition-transform">
          {/* Top stripe */}
          <div className="flex justify-between items-center text-[8px] font-sans font-bold tracking-widest text-white bg-[#8B0000] px-2 py-1 -mx-1">
            <span>RNI No. MP HIN/2026/XXXXX • REG. NO. MP/Bhopal/2026</span>
            <span className="hidden sm:inline">www.chitrakootjyoti.com • e-paper@chitrakootjyoti.com</span>
            <span>मूल्य ₹4.00 • 8 पृष्ठ</span>
          </div>

          {/* Masthead */}
          <div className="border-b-[4px] border-black pb-2 pt-2 text-center">
            <div className="flex items-center justify-center gap-3">
              <img src="/assets/logo.jpg" alt="लोगो" className="h-12 sm:h-14 w-auto object-contain border border-black/10 hidden sm:block" />
              <div>
                <h1 className="text-[40px] sm:text-[56px] font-black leading-none tracking-tighter text-[#8B0000]" style={{ fontFamily:'Noto Serif Devanagari, serif'}}>चित्रकूट ज्योति</h1>
                <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-slate-700 -mt-1">दैनिक • भोपाल • मध्यप्रदेश • चित्रकूट धाम</p>
              </div>
              <img src="/assets/founder.jpg" alt="संपादक" className="h-12 w-12 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-[#8B0000] hidden sm:block" />
            </div>
            <div className="flex justify-between items-center text-[9px] font-bold border-t border-black mt-2 pt-1">
              <span>संस्थापक संपादक: राजकुमार सोनी • भोपाल (मप्र)</span>
              <span className="hidden sm:inline">संपर्क: 8827294576, 8982635688 • chitrakootjyotinews@gmail.com</span>
              <span>शनिवार, 30 अगस्त 2026 • भाद्रपद शुक्ल सप्तमी</span>
            </div>
          </div>

          {/* Sub masthead info */}
          <div className="grid grid-cols-3 gap-2 text-[9px] font-bold border-b border-black py-1 bg-amber-50 px-2">
            <span>📍 भोपाल | इंदौर | जबलपुर | ग्वालियर | चित्रकूट</span>
            <span className="text-center text-[#8B0000]">“वैचारिक, सकारात्मक, समग्र समाचार”</span>
            <span className="text-right">पृष्ठ {selectedPage} / {totalPages} • {selectedEdition} संस्करण</span>
          </div>

          {/* Content */}
          <div className="my-4 grid grid-cols-12 gap-4 flex-1">
            <div className="col-span-8 border-r border-black pr-4 flex flex-col">
              <span className="text-[10px] font-black bg-[#8B0000] text-white px-2 py-0.5 inline-block self-start">पृष्ठ {selectedPage} — {pagesInfo[selectedPage-1].title}</span>
              <h2 className="text-[26px] font-black leading-tight mt-2 mb-2">{pagesInfo[selectedPage-1].lead}</h2>
              <p className="text-[11px] font-bold text-slate-600 border-b border-dashed pb-2">भोपाल/चित्रकूट • विशेष संवाददाता • ई-पेपर डेस्क</p>
              <p className="text-[12px] leading-relaxed mt-3 text-justify">
                {selectedPage===1 && 'प्रधानमंत्री ने चित्रकूट धाम में आयोजित भव्य समारोह में ₹4500 करोड़ की विकास परियोजनाओं का लोकार्पण किया। इस अवसर पर उन्होंने कहा कि चित्रकूट की आध्यात्मिक विरासत को आधुनिक सुविधाओं से जोड़ा जाएगा। कामदगिरि परिक्रमा पथ, रामघाट सौंदर्यीकरण और भोपाल-चित्रकूट फोरलेन प्रमुख योजनाएं हैं। मुख्यमंत्री ने संपादक राजकुमार सोनी द्वारा उठाए गए स्थानीय मुद्दों पर शीघ्र कार्रवाई का आश्वासन दिया।'}
                {selectedPage===2 && 'भोपाल मेट्रो के ट्रायल रन में 95% सफलता, मेट्रो रेल सुरक्षा आयुक्त ने हरी झंडी दी। एमपी नगर से एम्स तक 8 मिनट में सफर। भोपालवासियों में उत्साह, दिसंबर से आम जनता के लिए खुलेगा।'}
                {selectedPage===3 && 'कामदगिरि की 5 किमी परिक्रमा में आज 50 हजार से अधिक श्रद्धालु पहुंचे। चित्रकूट ज्योति धर्म डेस्क के अनुसार आज शनिवार को शनि पूजन का विशेष महत्व, भक्तों ने सरसों तेल चढ़ाया।'}
                {selectedPage===4 && 'संपादकीय: सकारात्मक पत्रकारिता ही समाज को दिशा देती है। चित्रकूट ज्योति का ध्येय — वैचारिक, निष्पक्ष और जनहितकारी खबर। विचार पृष्ठ पर विशेष लेख: “मध्यप्रदेश में जल संरक्षण”।'}
                {selectedPage===5 && 'अहमदाबाद टेस्ट में भारत की शानदार जीत। तेज गेंदबाज ने 5 विकेट लेकर ऑस्ट्रेलिया को 183 पर समेटा। कप्तान ने कहा — यह जीत चित्रकूट ज्योति के पाठकों को समर्पित।'}
                {selectedPage===6 && 'मनोरंजन जगत में मध्यप्रदेश की लोककला छाई, भोपाल की कलाकार ने राष्ट्रीय पुरस्कार जीता। लाइफस्टाइल: हेल्थ टिप्स — सावन में खानपान।'}
                {selectedPage===7 && 'भविष्य जिज्ञासा: आज का राशिफल — मेष को धन लाभ, वृषभ को यात्रा योग। पंचांग: अभिजीत मुहूर्त 11:52-12:42, राहुकाल 09:10-10:44। पंडित जी से परामर्श: chitrakootjyotinews@gmail.com पर संपर्क करें।'}
                {selectedPage===8 && 'विज्ञापन: भोपाल, सतना, रीवा, चित्रकूट में दुकान/मकान, नौकरी, वैवाहिक विज्ञापन। संपर्क: 8827294576, 8982635688'}
              </p>
              <div className="mt-4 border border-black p-1 bg-white">
                <img src={selectedPage===1 ? "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=900&q=80" : selectedPage===3 ? "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=900&q=80" : "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=900&q=80"} alt="news" className="w-full h-[220px] object-cover" />
                <p className="text-[8px] text-center bg-black text-white py-1">चित्र: चित्रकूट ज्योति फोटो डेस्क • फाइल फोटो</p>
              </div>
              <p className="text-[10px] text-slate-700 mt-3 leading-relaxed text-justify">
                शेष पृष्ठ {selectedPage < totalPages ? selectedPage+1 : 1} पर... स्थानीय संवाददाताओं की विस्तृत रिपोर्ट पढ़ें। चित्रकूट ज्योति ई-पेपर में हर खबर असली अखबार के लेआउट में — ज़ूम, शेयर और प्रिंट सुविधा उपलब्ध।
              </p>
              <div className="mt-auto pt-3 border-t border-dashed text-[10px] bg-amber-50 p-2">
                <span className="font-black text-[#8B0000]">📞 संपर्क:</span> संपादक राजकुमार सोनी — 8827294576, 8982635688 | ✉️ chitrakootjyotinews@gmail.com | 📍 भोपाल (मप्र)
              </div>
            </div>

            <div className="col-span-4 flex flex-col gap-4">
              <div className="border border-black p-2 bg-amber-50">
                <p className="text-[10px] font-black bg-black text-white px-1 py-0.5 inline-block">आज का पंचांग</p>
                <div className="text-[11px] mt-2 space-y-1 leading-tight">
                  <p><b>तिथि:</b> शुक्ल सप्तमी</p>
                  <p><b>नक्षत्र:</b> अनुराधा</p>
                  <p><b>योग:</b> वैधृति</p>
                  <p><b>राहुकाल:</b> 09:10-10:44</p>
                  <p className="text-[#8B0000] font-bold">अभिजीत 11:52-12:42 शुभ</p>
                </div>
                <p className="text-[9px] mt-2 border-t pt-1">पूरा पंचांग पृष्ठ 7 पर</p>
              </div>

              <div className="border-b border-black pb-3">
                <p className="text-[10px] font-black text-[#8B0000]">संक्षेप में</p>
                <h3 className="text-[13px] font-bold leading-tight mt-1">मप्र में निवेश प्रस्ताव ₹12 हजार करोड़ पार</h3>
                <p className="text-[11px] text-slate-700 mt-1">भोपाल में इन्वेस्टर मीट में 45 कंपनियों ने एमओयू साइन किए।</p>
              </div>

              <div className="border-b border-black pb-3">
                <p className="text-[10px] font-black text-[#8B0000]">संपादकीय</p>
                <h3 className="text-[13px] font-bold leading-tight mt-1">जल संरक्षण — चित्रकूट की सीख</h3>
                <p className="text-[11px] text-slate-700 mt-1">मंदाकिनी नदी के संरक्षण से पूरे बुंदेलखंड को दिशा।</p>
              </div>

              <div className="bg-[#8B0000] text-white p-2 rounded text-center">
                <p className="text-[11px] font-black">ई-पेपर प्रिंट संस्करण हूबहू</p>
                <p className="text-[9px] text-amber-200">ज़ूम • डाउनलोड • शेयर • प्रिंट</p>
                <div className="flex gap-1 justify-center mt-2">
                  <button className="bg-white text-[#8B0000] p-1 rounded"><Printer className="w-3 h-3" /></button>
                  <button className="bg-white text-[#8B0000] p-1 rounded"><Share2 className="w-3 h-3" /></button>
                  <button className="bg-white text-[#8B0000] px-2 py-1 rounded text-[10px] font-bold">PDF</button>
                </div>
              </div>

              <div className="border border-dashed border-black p-2 text-[9px] leading-tight bg-stone-50">
                <b>विज्ञापन:</b> चित्रकूट ज्योति में विज्ञापन हेतु संपर्क — 8827294576<br/>भोपाल, सतना, चित्रकूट में सबसे अधिक प्रसार
              </div>
            </div>
          </div>

          <div className="border-t-[3px] border-black pt-1 flex justify-between text-[8px] font-bold">
            <span>मुद्रक एवं प्रकाशक: राजकुमार सोनी द्वारा चित्रकूट ज्योति मीडिया, भोपाल (मप्र) से प्रकाशित</span>
            <span>पृष्ठ {selectedPage} / {totalPages}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        <button onClick={()=>setSelectedPage(p=>Math.max(1,p-1))} disabled={selectedPage===1} className="px-4 py-1.5 rounded-full border bg-white disabled:opacity-50 text-xs font-bold">← पिछला</button>
        <span className="px-3 py-1.5 bg-black text-white rounded-full text-xs font-mono">पृष्ठ {selectedPage} / {totalPages}</span>
        <button onClick={()=>setSelectedPage(p=>Math.min(totalPages,p+1))} disabled={selectedPage===totalPages} className="px-4 py-1.5 rounded-full border bg-white disabled:opacity-50 text-xs font-bold">अगला →</button>
      </div>
    </div>
  );
};
