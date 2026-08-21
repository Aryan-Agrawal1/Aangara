with open("app/sources/page.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Remove the premature ProvenanceFooter on line 63
content = content.replace("<ProvenanceFooter />", "")

# Fix active category styles
content = content.replace("bg-[#1E3A5F] text-blue-200 border-blue-600/50", "bg-[#0B4A3D] text-white border-[#0B4A3D]")
content = content.replace("bg-[#1E3A5F]/10 border border-[#1E3A5F]/30", "bg-[#F6F8F7] border border-[#E4E9E6]")
content = content.replace("bg-[#1E3A5F]/60 text-blue-300 border border-blue-700/40", "bg-[#E8F5F2] text-[#0B4A3D] border-[#0B4A3D]/20")

with open("app/sources/page.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("app/sources/page.tsx cleaned up!")