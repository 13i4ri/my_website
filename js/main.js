/**
 * Fun Facts Module
 * Random fun facts displayed on the homepage
 */

const funFacts = [
    "The first website ever made is still online!",
    "Did you know? A group of flamingos is called a 'flamboyance'.",
    "Nintendo was founded in 1889 as a playing card company.",
    "Honey never spoils! Archaeologists have found 3000-year-old honey that is still good.",
    "Octopuses have three hearts and blue blood!",
    "A day on Venus is longer than a year on Venus.",
    "Bananas are berries, but strawberries aren't!",
    "Water can boil and freeze at the same time, called the 'triple point'.",
    "A single cloud can weigh as much as a million pounds.",
    "There are more fake flamingos in the world than real ones.",
    "The Eiffel Tower can grow taller in the summer due to heat expansion.",
    "Cows have best friends and get stressed when separated.",
    "Sharks predate trees - they've been around for over 400 million years.",
    "Wombat poop is cube-shaped!",
    "A bolt of lightning is five times hotter than the surface of the sun.",
    "Humans share about 60% of their DNA with bananas.",
    "A shrimp's heart is located in its head.",
    "The dot over the lowercase 'i' and 'j' is called a tittle.",
    "Sloths can hold their breath longer than dolphins.",
    "A small child could swim through the veins of a blue whale.",
    "You can't hum while holding your nose.",
    "There are more stars in the universe than grains of sand on Earth.",
    "Cats have a unique 'fingerprint'—it's their nose print.",
    "A single teaspoon of honey represents the life's work of 12 bees.",
    "There's a species of jellyfish that can live forever.",
    "Some turtles can breathe through their butts.",
    "Pineapples take about two years to grow.",
    "A sneeze can travel up to 100 miles per hour.",
    "There's a town in Norway where the sun doesn't set for months.",
    "Oxford University is older than the Aztec Empire.",
    "Butterflies taste with their feet.",
    "The average cloud weighs about a million pounds.",
    "You blink about 20 times per minute, or over 10 million times per year.",
    "The speed of a computer mouse is measured in 'Mickeys'.",
    "Ketchup was once sold as medicine.",
    "An octopus can squeeze through any hole larger than its beak.",
    "The human body contains enough fat to make seven bars of soap.",
    "An ostrich's eye is bigger than its brain.",
    "The average person walks the equivalent of five times around the world in a lifetime.",
    "Dolphins have names for each other.",
    "A jiffy is an actual unit of time—1/100th of a second.",
    "You can't fold a piece of paper in half more than 7 times.",
    "Vending machines kill more people than sharks do each year.",
    "Snails can sleep for up to three years.",
    "Some sea cucumbers fight by shooting their own organs at enemies.",
    "Humans share around 98% of their DNA with chimpanzees.",
    "Your brain generates enough electricity to power a light bulb.",
    "A group of crows is called a 'murder'.",
    "Most people have fewer than five close friends.",
    "The shortest war in history lasted just 38 to 45 minutes.",
    "A bolt of lightning contains enough energy to toast 100,000 slices of bread.",
    "The smell of freshly cut grass is actually a plant distress signal.",
    "The word 'alphabet' comes from the first two letters of the Greek alphabet, alpha and beta.",
    "Bubble wrap was originally invented as wallpaper.",
    "If you could fold a piece of paper 42 times, it would reach the moon.",
    "Coca-Cola was the first soft drink consumed in space.",
    "A day on Mars is only about 37 minutes longer than a day on Earth.",
    "There's a gas cloud in space that smells like rum and tastes like raspberries.",
    "Banging your head against a wall burns 150 calories an hour (but not recommended!).",
    "The scientific name for the Western lowland gorilla is Gorilla gorilla gorilla.",
    "Pigs can't look up at the sky.",
    "Ants can lift up to 50 times their own body weight.",
    "The heart of a blue whale is the size of a small car.",
    "The first oranges weren't orange—they were green!",
    "There's a species of fish that can climb waterfalls.",
    "It's illegal to own only one guinea pig in Switzerland—it's considered animal cruelty.",
    "Every planet in our solar system could fit between Earth and the moon.",
    "Your ears and nose never stop growing.",
    "A newborn kangaroo is the size of a jellybean.",
    "There are more trees on Earth than stars in the Milky Way.",
    "Venus is the hottest planet in our solar system, not Mercury.",
    "A strawberry isn't actually a berry, but an avocado is.",
    "A flea can jump 350 times its body length.",
    "A crocodile can't stick its tongue out.",
    "The inventor of the frisbee was turned into a frisbee after he died.",
    "The human body has about the same number of bacteria as human cells.",
    "Astronauts can't burp in space due to lack of gravity.",
    "There's a basketball court on top of the U.S. Supreme Court called the 'Highest Court in the Land'.",
    "A jellyfish is 95% water.",
    "Bananas glow blue under black light.",
    "A cat's purr has healing properties.",
    "Alaska is the only U.S. state that can be typed on one row of a keyboard.",
    "There are more chickens on Earth than humans.",
    "You can't tickle yourself because your brain predicts the sensation.",
    "Some turtles can breathe through their skin.",
    "If you drilled a hole through the Earth and jumped in, it would take about 42 minutes to get to the other side.",
    "Rats and mice laugh when tickled.",
    "The longest hiccuping spree lasted 68 years.",
    "A snail has thousands of tiny teeth on its tongue.",
    "There's a lizard that can squirt blood from its eyes as a defense mechanism.",
    "Your stomach gets a new lining every few days to prevent it from digesting itself.",
    "Sharks existed before trees.",
    "There's a hotel in Canada made entirely of ice.",
    "The moon has moonquakes.",
    "A goldfish's memory span is much longer than three seconds.",
    "There's an island in Japan full of bunnies.",
    "Sea otters hold hands while sleeping so they don't drift apart."
];

/**
 * Get a random fun fact
 * @returns {string} A random fun fact
 */
function getRandomFact() {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    return funFacts[randomIndex];
}

/**
 * Display a random fun fact in the page
 */
function displayFunFact() {
    const element = document.getElementById("fun-fact");
    if (element) {
        element.textContent = getRandomFact();
    }
}

/**
 * Load marquee text from external file
 * @param {string} url - URL to the marquee text file
 */
function loadMarqueeText(url) {
    const marquee = document.getElementById('main-marquee');
    if (!marquee) return;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Failed to load marquee');
            return response.text();
        })
        .then(text => {
            marquee.textContent = text.replace(/\s+/g, ' ').trim();
        })
        .catch(() => {
            marquee.textContent = 'welcome to my site web.';
        });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    displayFunFact();
    loadMarqueeText('data/connect-marquee.txt');
});
