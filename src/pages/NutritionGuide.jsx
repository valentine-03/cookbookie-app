import { useState } from 'react'
import Icon from '../components/Icon'

const TABLE_ROWS = [
  { type: 'Breakfast', cal: '350–500', protein: '15–25', carbs: '45–65', fat: '10–20', nutrients: 'Iron, B12, fiber, calcium' },
  { type: 'Lunch', cal: '400–650', protein: '20–35', carbs: '50–75', fat: '12–25', nutrients: 'Vitamin C, vitamin D, magnesium' },
  { type: 'Dinner', cal: '500–750', protein: '25–45', carbs: '40–70', fat: '15–30', nutrients: 'Protein, omega-3, zinc, potassium' },
  { type: 'Dessert', cal: '200–450', protein: '3–8', carbs: '30–60', fat: '10–22', nutrients: 'Calcium, antioxidants' },
  { type: 'Snacks', cal: '100–250', protein: '4–12', carbs: '15–35', fat: '4–15', nutrients: 'Fiber, vitamins A & E, healthy fats' },
]

const FAQS = [
  ['How many calories should a healthy breakfast have?', 'A balanced breakfast typically provides 350 to 500 calories, about 20–25% of daily intake. Prioritize protein and fiber with options like eggs and whole-grain toast, Greek yogurt with fruit, or oatmeal with nuts.'],
  ['What makes a balanced lunch?', 'Include lean protein, complex carbohydrates, and plenty of vegetables. Healthy fats like avocado or olive oil help keep energy stable through the afternoon.'],
  ['How can I make my dinners healthier?', 'Focus on lean proteins and non-starchy vegetables, and limit refined carbs. A helpful visual is half vegetables, one-quarter protein, and one-quarter whole grains.'],
  ['Are desserts OK in a healthy diet?', 'Yes, in moderation. Whole-ingredient desserts can satisfy cravings without derailing your goals. Portion and frequency are what matter most.'],
  ['What should I keep in mind when planning meals?', 'Aim for variety, listen to your energy needs, and make room for foods you genuinely enjoy. This page is a general reference, not personalized medical advice.'],
]

export default function NutritionGuide() {
  const [openIndex, setOpenIndex] = useState(null)
  return (
    <div className="guide-page">
      <div className="page-header"><div><p className="eyebrow">A little guidance for your plate</p><h1>Nutrition Guide</h1><p className="intro-copy">A friendly reference for building balanced meals around the recipes you love.</p></div></div>
      <div className="guide-callout"><Icon name="lightbulb" /><div><strong>Keep it simple</strong><p>Use these ranges as a starting point, then choose ingredients and portions that fit your own routine.</p></div></div>
      <div className="table-wrapper"><table className="nutrition-table"><caption>Average nutritional ranges by meal category</caption><thead><tr><th>Meal type</th><th>Calories</th><th>Protein (g)</th><th>Carbs (g)</th><th>Fat (g)</th><th>Key nutrients</th></tr></thead><tbody>{TABLE_ROWS.map((row) => <tr key={row.type}><th>{row.type}</th><td>{row.cal}</td><td>{row.protein}</td><td>{row.carbs}</td><td>{row.fat}</td><td>{row.nutrients}</td></tr>)}</tbody></table></div>
      <h2 className="guide-subheading">Nutrition FAQ</h2>
      <div className="guide-card">{FAQS.map(([question, answer], index) => <div key={question} className={`faq-item ${openIndex === index ? 'open' : ''}`}><button className="faq-question" onClick={() => setOpenIndex(openIndex === index ? null : index)} aria-expanded={openIndex === index}>{question}<Icon name="expand_more" /></button><div className="faq-answer">{answer}</div></div>)}</div>
    </div>
  )
}