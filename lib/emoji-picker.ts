/**
 * Emoji Picker - Selects relevant emoji based on market question and description
 * Uses keyword matching to pick the most appropriate emoji
 */

export function pickEmojiForMarket(question: string, description?: string | null): string {
  const text = `${question} ${description || ''}`.toLowerCase()

  // Weather-related
  if (/\b(rain|snow|sun|cloud|weather|storm|hurricane|tornado|wind|temperature|hot|cold|sunny|cloudy)\b/.test(text)) {
    const weatherEmojis = ['🌧️', '⛈️', '🌨️', '☀️', '⛅', '🌤️', '🌦️', '❄️', '🌪️', '🌡️']
    return weatherEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % weatherEmojis.length]
  }

  // Sports
  if (/\b(sport|football|basketball|soccer|baseball|hockey|tennis|golf|olympics|game|match|team|player|win|champion)\b/.test(text)) {
    const sportsEmojis = ['⚽', '🏀', '🏈', '⚾', '🎾', '🏒', '⛳', '🏆', '🥇', '🎯']
    return sportsEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % sportsEmojis.length]
  }

  // Technology
  if (/\b(tech|computer|phone|app|software|ai|robot|internet|website|digital|code|programming|startup)\b/.test(text)) {
    const techEmojis = ['💻', '📱', '🤖', '⚡', '🔌', '💾', '🌐', '⌨️', '🖥️', '📡']
    return techEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % techEmojis.length]
  }

  // Money/Finance
  if (/\b(money|dollar|price|cost|budget|economy|stock|market|invest|profit|revenue|salary|pay)\b/.test(text)) {
    const moneyEmojis = ['💰', '💵', '💸', '💳', '📈', '📉', '💼', '🏦', '💎', '💴']
    return moneyEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % moneyEmojis.length]
  }

  // Food
  if (/\b(food|eat|restaurant|pizza|burger|coffee|drink|meal|dinner|lunch|breakfast|cook|recipe)\b/.test(text)) {
    const foodEmojis = ['🍕', '🍔', '🌮', '🍜', '🍣', '☕', '🍰', '🍟', '🌭', '🥗']
    return foodEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % foodEmojis.length]
  }

  // Politics
  if (/\b(president|election|vote|politic|government|senate|congress|candidate|campaign|democrat|republican)\b/.test(text)) {
    const politicsEmojis = ['🗳️', '🏛️', '📜', '👔', '🎩', '📢', '🗣️', '🏛️', '⚖️', '📋']
    return politicsEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % politicsEmojis.length]
  }

  // Entertainment
  if (/\b(movie|film|show|tv|series|actor|celebrity|music|song|album|concert|festival|award|oscar|grammy)\b/.test(text)) {
    const entertainmentEmojis = ['🎬', '🎭', '🎤', '🎧', '🎸', '🎹', '🎪', '🎨', '📺', '🎞️']
    return entertainmentEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % entertainmentEmojis.length]
  }

  // Health/Medical
  if (/\b(health|doctor|hospital|medicine|drug|vaccine|sick|illness|disease|treatment|cure|medical)\b/.test(text)) {
    const healthEmojis = ['🏥', '💊', '🩺', '🩹', '💉', '🧬', '⚕️', '🦠', '😷', '🤒']
    return healthEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % healthEmojis.length]
  }

  // Education
  if (/\b(school|university|college|student|teacher|exam|test|grade|degree|learn|study|education)\b/.test(text)) {
    const educationEmojis = ['🎓', '📚', '✏️', '📝', '📖', '🎒', '🏫', '📊', '📐', '🔬']
    return educationEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % educationEmojis.length]
  }

  // Travel
  if (/\b(travel|trip|vacation|flight|airplane|hotel|beach|mountain|city|country|visit|tourist)\b/.test(text)) {
    const travelEmojis = ['✈️', '🏖️', '🗺️', '🧳', '🚗', '🏨', '🌍', '🗽', '⛰️', '🏝️']
    return travelEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % travelEmojis.length]
  }

  // Time/Dates
  if (/\b(tomorrow|today|next week|next month|year|date|deadline|time|soon|future|past)\b/.test(text)) {
    const timeEmojis = ['📅', '⏰', '🕐', '📆', '⏳', '⌛', '🗓️', '⏱️', '🕰️', '📆']
    return timeEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % timeEmojis.length]
  }

  // Questions/Uncertainty
  if (/\b(will|would|could|should|maybe|perhaps|might|possibly|probably|chance|likely)\b/.test(text)) {
    const questionEmojis = ['🤔', '❓', '💭', '🤷', '🎲', '🎯', '🔮', '✨', '⭐', '💫']
    return questionEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % questionEmojis.length]
  }

  // Default: pick based on first letter or random
  const defaultEmojis = ['🎯', '💡', '🔥', '⭐', '🚀', '💎', '🎲', '🎪', '🎨', '🌟']
  return defaultEmojis[Math.abs(text.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % defaultEmojis.length]
}

