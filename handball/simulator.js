/**
 * Handball Shot Simulator
 * 
 * Main controller module that handles user interaction,
 * coordinates between court renderer and probability model,
 * and updates the UI.
 */

const Simulator = (function() {
    
    // DOM Elements
    let canvas = null;
    let defenderSlider = null;
    let defenderValueDisplay = null;
    let distanceDisplay = null;
    let angleDisplay = null;
    let probabilityDisplay = null;
    
    // Current state
    let currentShot = null;
    
    /**
     * Initialize the simulator
     */
    function init() {
        // Get DOM elements
        canvas = document.getElementById('handball-court');
        defenderSlider = document.getElementById('defender-distance');
        defenderValueDisplay = document.getElementById('defender-distance-value');
        distanceDisplay = document.getElementById('shot-distance');
        angleDisplay = document.getElementById('shot-angle');
        probabilityDisplay = document.getElementById('goal-probability');
        
        // Initialize court renderer
        CourtRenderer.init(canvas);
        
        // Set up event listeners
        setupEventListeners();
        
        console.log('Handball Shot Simulator initialized');
    }
    
    /**
     * Set up all event listeners
     */
    function setupEventListeners() {
        // Canvas click handler
        canvas.addEventListener('click', handleCanvasClick);
        
        // Defender distance slider
        defenderSlider.addEventListener('input', handleDefenderChange);
        
        // Handle window resize for responsive canvas
        window.addEventListener('resize', handleResize);
    }
    
    /**
     * Handle canvas click events
     * 
     * @param {MouseEvent} event - The click event
     */
    function handleCanvasClick(event) {
        // Get click position relative to canvas
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const canvasX = (event.clientX - rect.left) * scaleX;
        const canvasY = (event.clientY - rect.top) * scaleY;
        
        // Process the shot
        processShot(canvasX, canvasY);
    }
    
    /**
     * Process a shot at the given canvas coordinates
     * 
     * @param {number} canvasX - X position on canvas
     * @param {number} canvasY - Y position on canvas
     */
    function processShot(canvasX, canvasY) {
        // Get goal position
        const goalPos = CourtRenderer.getGoalPosition();
        
        // Convert to court coordinates (meters)
        const courtCoords = CourtRenderer.canvasToCourtCoordinates(canvasX, canvasY);
        
        // Calculate distance to goal
        const distance = calculateDistance(canvasX, canvasY, goalPos.x, goalPos.y, courtCoords);
        
        // Calculate angle to goal
        const angle = calculateAngle(canvasX, canvasY, goalPos.x, goalPos.y);
        
        // Get defender distance from slider
        const defenderDistance = parseFloat(defenderSlider.value);
        
        // Store current shot data
        currentShot = {
            canvasX,
            canvasY,
            courtX: courtCoords.x,
            courtY: courtCoords.y,
            distance,
            angle,
            defenderDistance
        };
        
        // Update court visualization
        CourtRenderer.setShotPosition(canvasX, canvasY);
        
        // Calculate probability
        const result = ProbabilityModel.estimateProbability({
            distance: distance,
            angle: angle,
            defenderDistance: defenderDistance
        });
        
        // Update UI
        updateDisplay(distance, angle, defenderDistance, result);
    }
    
    /**
     * Calculate distance from shot position to goal
     * Uses court coordinates for real-world meters
     * 
     * @param {number} shotX - Shot X on canvas
     * @param {number} shotY - Shot Y on canvas
     * @param {number} goalX - Goal X on canvas
     * @param {number} goalY - Goal Y on canvas
     * @param {Object} courtCoords - Court coordinates in meters
     * @returns {number} Distance in meters
     */
    function calculateDistance(shotX, shotY, goalX, goalY, courtCoords) {
        // Use court coordinates for real distance calculation
        // Goal is at (0, 0) in court coordinates
        const dx = courtCoords.x;  // Distance from center
        const dy = courtCoords.y;  // Distance from goal line
        
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    /**
     * Calculate shooting angle relative to goal
     * 0 degrees = straight on, positive = right side, negative = left side
     * 
     * @param {number} shotX - Shot X position
     * @param {number} shotY - Shot Y position
     * @param {number} goalX - Goal center X
     * @param {number} goalY - Goal center Y
     * @returns {number} Angle in degrees
     */
    function calculateAngle(shotX, shotY, goalX, goalY) {
        const dx = shotX - goalX;
        const dy = shotY - goalY;
        
        // atan2 gives angle from positive x-axis
        // We want angle from straight-on (y-axis from shooter's perspective)
        const radians = Math.atan2(Math.abs(dx), dy);
        const degrees = radians * (180 / Math.PI);
        
        return degrees;
    }
    
    /**
     * Handle defender distance slider change
     */
    function handleDefenderChange() {
        const value = parseFloat(defenderSlider.value);
        defenderValueDisplay.textContent = `${value.toFixed(1)} m`;
        
        // Recalculate probability if we have a shot
        if (currentShot) {
            currentShot.defenderDistance = value;
            
            const result = ProbabilityModel.estimateProbability({
                distance: currentShot.distance,
                angle: currentShot.angle,
                defenderDistance: value
            });
            
            updateDisplay(
                currentShot.distance, 
                currentShot.angle, 
                value, 
                result
            );
        }
    }
    
    /**
     * Handle window resize
     */
    function handleResize() {
        // Re-render the court
        CourtRenderer.render();
    }
    
    /**
     * Update the display panel with shot data
     * 
     * @param {number} distance - Shot distance in meters
     * @param {number} angle - Shot angle in degrees
     * @param {number} defenderDistance - Defender distance in meters
     * @param {Object} result - Probability calculation result
     */
    function updateDisplay(distance, angle, defenderDistance, result) {
        // Update distance
        distanceDisplay.textContent = `${distance.toFixed(1)} m`;
        
        // Update angle
        angleDisplay.textContent = `${angle.toFixed(0)}°`;
        
        // Update defender distance
        defenderValueDisplay.textContent = `${defenderDistance.toFixed(1)} m`;
        
        // Update probability with animation
        probabilityDisplay.classList.remove('updated');
        void probabilityDisplay.offsetWidth; // Trigger reflow
        probabilityDisplay.classList.add('updated');
        probabilityDisplay.textContent = `${result.percentage}%`;
        
        // Color code probability
        updateProbabilityColor(result.percentage);
    }
    
    /**
     * Update probability display color based on value
     * 
     * @param {number} percentage - Probability percentage
     */
    function updateProbabilityColor(percentage) {
        let color;
        
        if (percentage >= 70) {
            color = '#00ff00';  // High probability - bright green
        } else if (percentage >= 50) {
            color = '#ffff00';  // Medium probability - yellow
        } else if (percentage >= 30) {
            color = '#ff8800';  // Low probability - orange
        } else {
            color = '#ff0000';  // Very low probability - red
        }
        
        probabilityDisplay.style.color = color;
        probabilityDisplay.style.textShadow = `2px 2px black`;
    }
    
    /**
     * Reset the simulator to initial state
     */
    function reset() {
        currentShot = null;
        CourtRenderer.clearShotPosition();
        
        distanceDisplay.textContent = '— m';
        angleDisplay.textContent = '— °';
        probabilityDisplay.textContent = '— %';
        probabilityDisplay.style.color = '#4ecdc4';
        
        defenderSlider.value = 2.5;
        defenderValueDisplay.textContent = '2.5 m';
    }
    
    /**
     * Get current shot data (for debugging/testing)
     */
    function getCurrentShot() {
        return currentShot ? { ...currentShot } : null;
    }
    
    // Public API
    return {
        init,
        reset,
        getCurrentShot
    };
    
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    Simulator.init();
});
