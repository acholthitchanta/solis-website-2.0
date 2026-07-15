import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

export default function Test2() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFiles() {
      const { data, error } = await supabase.storage.from('sponsors').list();
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      // Turn each file into a public URL
      const filesWithUrls = data.map((file) => {
        const { data: urlData } = supabase.storage
          .from('sponsors')
          .getPublicUrl(file.name);
        return { ...file, publicUrl: urlData.publicUrl };
      });

      setFiles(filesWithUrls);
      setLoading(false);
    }

    fetchFiles();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Sponsors Bucket ({files.length} files)</h1>
      {files.map((file) => (
        <div key={file.name} style={{ marginBottom: '1rem' }}>
          <img src={file.publicUrl} alt={file.name} width={120} />
        </div>
      ))}
    </div>
  );
}