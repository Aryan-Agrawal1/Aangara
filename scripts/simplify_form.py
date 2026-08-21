import re

file_path = r'd:\work\carbon alpha 2.0\frontend\components\intelligence\FacilityInputForm.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove currentStep state
content = re.sub(r'const \[currentStep, setCurrentStep\] = useState<1 \| 2 \| 3 \| 4>\(1\);', '', content)

# 2. Remove steps array and its rendering block
content = re.sub(r'const steps = \[\s*\{[\s\S]*?\}\s*\];\s*// Helper tooltip component', '// Helper tooltip component', content)
content = re.sub(r'\{\/\* Guided Progressive Disclosure Wizard Steps \*\/\}([\s\S]*?)<form onSubmit', '<form onSubmit', content)

# 3. Remove step wrappers
content = content.replace('{currentStep === 1 && (', '')
content = content.replace('{currentStep === 2 && (', '')
content = content.replace('{currentStep === 3 && (', '')
content = content.replace('{currentStep === 4 && (', '')

# Remove footers
footer1 = """            {/* Navigation Footer */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center space-x-1.5 transition-all cursor-pointer border border-slate-700"
              >
                <span>Continue to Energy Streams</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        )}"""
content = content.replace(footer1, '</div>')

footer2 = """            {/* Navigation Footer */}
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center space-x-1.5 transition-all cursor-pointer border border-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Profile</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center space-x-1.5 transition-all cursor-pointer border border-slate-700"
              >
                <span>Continue to Process Parameters</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        )}"""
content = content.replace(footer2, '</div>')

footer3 = """            {/* Navigation Footer */}
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center space-x-1.5 transition-all cursor-pointer border border-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Energy</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white flex items-center space-x-1.5 transition-all cursor-pointer border border-slate-700"
              >
                <span>Proceed to Data Audit & Confirmation</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        )}"""
content = content.replace(footer3, '</div>')

footer4_nav = """            {/* Navigation & Submit Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 flex items-center justify-center space-x-1.5 transition-all cursor-pointer border border-slate-800"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Process Data</span>
              </button>

              <button"""
content = content.replace(footer4_nav, """            {/* Navigation & Submit Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-800/60 mt-4">
              <button""")

content = content.replace("""          </div>
        )}
      </form>""", """          </div>
      </form>""")

# Replace required min="1" with min="0" since production can be 0 or small
content = content.replace('min="1"', 'min="0"')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done modifying FacilityInputForm.tsx')
