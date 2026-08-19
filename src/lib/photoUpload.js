import { supabase } from '../supabaseClient'

export async function uploadRecipePhoto(file, userId) {
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('recipe-photos')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('recipe-photos').getPublicUrl(filePath)
  return data.publicUrl
}