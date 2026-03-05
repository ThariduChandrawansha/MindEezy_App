filepath = r"c:\Users\Savi Aby\Desktop\Tharindu Final\MindEezy_App\frontend\src\pages\CustomerProfile.jsx"

with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# Exact marker from the debug output
old = "                    </div>\n\n                    {/* Days of Week Header */}"

new = """                    </div>

                    {/* AI Suggested Professionals */}
                    {suggestedDoctors.length > 0 && (
                      <div className="mb-6 rounded-2xl border border-violet-100 bg-white shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-100 rounded-xl">
                              <Stethoscope className="h-5 w-5 text-violet-600" />
                            </div>
                            <div>
                              <h4 className="font-black text-slate-800 tracking-tight">AI-Recommended Professionals</h4>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                Matched to your {mentalSummary?.text?.toLowerCase() || 'emotional'} state
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate('/professionals')}
                            className="flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors px-3 py-1.5 bg-white rounded-xl border border-violet-200 hover:border-violet-400"
                          >
                            View All <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="divide-y divide-slate-50">
                          {suggestedDoctors.map((doc, i) => (
                            <div key={doc.id} className="p-4 flex items-center gap-4 hover:bg-violet-50/30 transition-colors group">
                              <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${i === 0 ? 'bg-amber-400 text-white' : i === 1 ? 'bg-slate-300 text-slate-700' : 'bg-orange-300 text-white'}`}>{i + 1}</div>
                              <div className="shrink-0 h-12 w-12 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center font-black text-lg overflow-hidden border-2 border-violet-100 shadow">
                                {doc.profile_pic_path ? (
                                  <img src={`http://localhost:5000${doc.profile_pic_path}`} className="h-full w-full object-cover" alt="" />
                                ) : (
                                  doc.username?.charAt(0).toUpperCase()
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-black text-slate-800 truncate">{doc.username}</p>
                                <p className="text-xs text-violet-600 font-bold uppercase tracking-wider truncate mt-0.5">{doc.specialty || 'General Counseling'}</p>
                                {doc.avg_rating ? (
                                  <div className="flex items-center gap-1 mt-1">
                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                    <span className="text-xs text-slate-500 font-bold">{parseFloat(doc.avg_rating).toFixed(1)} <span className="font-normal text-slate-400">({doc.review_count} reviews)</span></span>
                                  </div>
                                ) : <p className="text-[10px] text-slate-400 font-bold mt-1">No reviews yet</p>}
                                {doc.experience_years && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{doc.experience_years} yrs experience</p>}
                              </div>
                              <button
                                onClick={() => navigate(`/professionals/${doc.id}`)}
                                className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-md group-hover:scale-105"
                              >
                                <UserCheck className="h-3.5 w-3.5" /> View
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Days of Week Header */}"""

if old in content:
    new_content = content.replace(old, new, 1)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("SUCCESS: Inserted Suggested Professionals block")
else:
    print("FAILED: Marker still not found")
    idx = content.find("Days of Week Header")
    print(repr(content[idx-200:idx+50]))
