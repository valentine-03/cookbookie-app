import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useRecipes } from '../hooks/useRecipes'
import { uploadRecipePhoto } from '../lib/photoUpload'
import Icon from '../components/Icon'

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack']

export default function AddRecipe() {
  const { user } = useAuth()
  const { addRecipe } = useRecipes()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', category: 'Lunch', prep_time: '', cook_time: '', ingredients: '', instructions: '', calories: '', protein: '', carbs: '', fat: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState(null)
  const [dragOver, setDragOver] = useState(false)

  function update(field, value) { setForm((prev) => ({ ...prev, [field]: value })) }
  function handlePhotoFile(file) {
    if (!file || !file.type.startsWith('image/')) { setError('Please choose an image file.'); return }
    setPhotoFile(file)
    setPhotoPreviewUrl(URL.createObjectURL(file))
    setError('')
  }
  function removePhoto() { setPhotoFile(null); setPhotoPreviewUrl(null) }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.title.trim()) { setError('Please give the recipe a title.'); return }
    setBusy(true)
    setError('')
    try {
      const imageUrl = photoFile ? await uploadRecipePhoto(photoFile, user.id) : null
      const payload = {
        title: form.title.trim(), category: form.category,
        prep_time: form.prep_time ? Number(form.prep_time) : null,
        cook_time: form.cook_time ? Number(form.cook_time) : null,
        ingredients: form.ingredients.split('\n').map((item) => item.trim()).filter(Boolean),
        instructions: form.instructions.split('\n').map((item) => item.trim()).filter(Boolean),
        calories: form.calories ? Number(form.calories) : null,
        protein: form.protein ? Number(form.protein) : null,
        carbs: form.carbs ? Number(form.carbs) : null,
        fat: form.fat ? Number(form.fat) : null,
        image_url: imageUrl,
      }
      const result = await addRecipe(payload)
      if (result.error) throw result.error
      navigate(`/recipes/${result.data.id}`)
    } catch (submitError) {
      setError(submitError.message || 'We could not save that recipe. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="form-container">
      <div className="page-header">
        <div><p className="eyebrow">Save something delicious</p><h1>Add a Recipe</h1></div>
      </div>
      <form className="recipe-form-card" onSubmit={handleSubmit}>
        <div className="form-section-heading"><Icon name="photo_camera" /><div><h2>Recipe cover</h2><p>Give your recipe a little personality.</p></div></div>
        {!photoPreviewUrl ? (
          <div className={`photo-upload ${dragOver ? 'drag-over' : ''}`} onClick={() => document.getElementById('photoInput').click()} onDragOver={(e) => { e.preventDefault(); setDragOver(true) }} onDragLeave={() => setDragOver(false)} onDrop={(e) => { e.preventDefault(); setDragOver(false); handlePhotoFile(e.dataTransfer.files[0]) }}>
            <Icon name="cloud_upload" className="upload-icon" />
            <strong>Upload your own photo</strong>
            <span>Drag and drop, or click to browse</span>
          </div>
        ) : (
          <div className="photo-preview"><img src={photoPreviewUrl} alt="Recipe preview" /><div><strong>{photoFile.name}</strong><span>Ready to save with this recipe</span></div><button type="button" className="btn-secondary" onClick={removePhoto}>Remove</button></div>
        )}
        <input id="photoInput" type="file" accept="image/*" hidden onChange={(e) => handlePhotoFile(e.target.files[0])} />

        <div className="form-section-heading"><Icon name="menu_book" /><div><h2>The essentials</h2><p>Start with the details you will want to remember.</p></div></div>
        <div className="form-group"><label htmlFor="title">Recipe title</label><input id="title" required value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Sunday morning pancakes" /></div>
        <div className="form-row">
          <div className="form-group"><label htmlFor="category">Category</label><select id="category" value={form.category} onChange={(e) => update('category', e.target.value)}>{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></div>
          <div className="form-group"><label htmlFor="prep_time">Prep time (min)</label><input id="prep_time" type="number" min="0" value={form.prep_time} onChange={(e) => update('prep_time', e.target.value)} placeholder="15" /></div>
        </div>
        <div className="form-group"><label htmlFor="cook_time">Cook time (min)</label><input id="cook_time" type="number" min="0" value={form.cook_time} onChange={(e) => update('cook_time', e.target.value)} placeholder="20" /></div>
        <div className="form-group"><label htmlFor="ingredients">Ingredients <span className="label-hint">one per line</span></label><textarea id="ingredients" rows="7" value={form.ingredients} onChange={(e) => update('ingredients', e.target.value)} placeholder={'2 cups flour\n1 cup milk\n2 eggs'} /></div>
        <div className="form-group"><label htmlFor="instructions">Instructions <span className="label-hint">one step per line</span></label><textarea id="instructions" rows="7" value={form.instructions} onChange={(e) => update('instructions', e.target.value)} placeholder={'Mix the ingredients together.\nCook until golden.\nServe warm.'} /></div>

        <details className="optional-details">
          <summary>Optional nutrition details <Icon name="expand_more" /></summary>
          <p className="helper-copy">You can record values you already know. CookBookie does not calculate nutrition automatically.</p>
          <div className="nutrition-input-grid">
            {['calories', 'protein', 'carbs', 'fat'].map((field) => <div className="form-group" key={field}><label htmlFor={field}>{field[0].toUpperCase() + field.slice(1)}{field !== 'calories' ? ' (g)' : ''}</label><input id={field} type="number" min="0" value={form[field]} onChange={(e) => update(field, e.target.value)} /></div>)}
          </div>
        </details>

        {error && <p className="error-banner" role="alert">{error}</p>}
        <div className="form-actions"><button className="btn-secondary" type="button" onClick={() => navigate(-1)}>Cancel</button><button className="btn-primary" type="submit" disabled={busy}>{busy ? 'Saving...' : 'Save Recipe'} <Icon name="arrow_forward" /></button></div>
      </form>
    </div>
  )
}