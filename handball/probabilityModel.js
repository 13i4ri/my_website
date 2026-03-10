/**
 * Probability Model for Handball Shot Simulator
 * 
 * This module is responsible for estimating the probability of scoring
 * based on shot parameters. Currently uses a simple random model with
 * logical constraints. Can be replaced with real statistical models later.
 * 
 * FUTURE EXTENSIONS:
 * - Logistic regression model
 * - Machine learning predictions
 * - Player-specific statistics
 * - Historical shot data analysis
 */

const ProbabilityModel = (function() {
    
    /**
     * Configuration for the probability calculation
     * Adjust these values to tune the model behavior
     */
    const CONFIG = {
        // Base probability range
        BASE_MIN: 0.3,
        BASE_MAX: 0.8,
        
        // Distance thresholds (in meters)
        OPTIMAL_DISTANCE: 7,      // Ideal shooting distance
        MAX_DISTANCE: 20,         // Beyond this, very low probability
        
        // Angle thresholds (in degrees)
        OPTIMAL_ANGLE: 0,         // Straight on goal
        MAX_ANGLE: 80,            // Very wide angle
        
        // Defender impact
        DEFENDER_CLOSE: 1,        // Very close defender (meters)
        DEFENDER_FAR: 5,          // No impact beyond this
        
        // Random noise range
        NOISE_RANGE: 0.1,
        
        // Final probability bounds
        MIN_PROBABILITY: 0.05,
        MAX_PROBABILITY: 0.95
    };
    
    /**
     * Calculate distance factor
     * Closer shots (around 7m) have higher probability
     * Very close or very far shots have lower probability
     * 
     * @param {number} distance - Shot distance in meters
     * @returns {number} Factor between 0 and 1
     */
    function calculateDistanceFactor(distance) {
        // Optimal distance is around 7 meters (6m line + 1m)
        const optimalDistance = CONFIG.OPTIMAL_DISTANCE;
        
        if (distance <= 0) return 0.5;
        
        // Create a bell curve around optimal distance
        const deviation = Math.abs(distance - optimalDistance);
        const factor = Math.exp(-(deviation * deviation) / 50);
        
        // Penalize very far shots more heavily
        if (distance > CONFIG.MAX_DISTANCE) {
            return Math.max(0.1, factor * 0.5);
        }
        
        return Math.max(0.2, Math.min(1, factor));
    }
    
    /**
     * Calculate angle factor
     * Shots from straight on have higher probability
     * Wide angles reduce scoring chance
     * 
     * @param {number} angle - Shot angle in degrees (0 = straight on)
     * @returns {number} Factor between 0 and 1
     */
    function calculateAngleFactor(angle) {
        const normalizedAngle = Math.abs(angle);
        
        if (normalizedAngle <= 15) {
            // Good shooting angle
            return 1.0;
        } else if (normalizedAngle <= 30) {
            // Moderate angle
            return 0.9;
        } else if (normalizedAngle <= 45) {
            // Challenging angle
            return 0.75;
        } else if (normalizedAngle <= 60) {
            // Difficult angle
            return 0.5;
        } else {
            // Very wide angle
            return Math.max(0.2, 1 - (normalizedAngle / 90));
        }
    }
    
    /**
     * Calculate defender impact factor
     * Close defenders significantly reduce scoring probability
     * 
     * @param {number} defenderDistance - Distance to nearest defender in meters
     * @returns {number} Factor between 0 and 1
     */
    function calculateDefenderFactor(defenderDistance) {
        if (defenderDistance >= CONFIG.DEFENDER_FAR) {
            // No defender impact
            return 1.0;
        } else if (defenderDistance <= CONFIG.DEFENDER_CLOSE) {
            // Very close defender - significant penalty
            return 0.3;
        } else {
            // Linear interpolation between close and far
            const range = CONFIG.DEFENDER_FAR - CONFIG.DEFENDER_CLOSE;
            const normalized = (defenderDistance - CONFIG.DEFENDER_CLOSE) / range;
            return 0.3 + (normalized * 0.7);
        }
    }
    
    /**
     * Add random noise to simulate real-world variance
     * 
     * @returns {number} Random noise value
     */
    function addNoise() {
        return (Math.random() - 0.5) * CONFIG.NOISE_RANGE;
    }
    
    /**
     * Clamp a value between min and max
     * 
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum bound
     * @param {number} max - Maximum bound
     * @returns {number} Clamped value
     */
    function clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }
    
    /**
     * Main probability estimation function
     * 
     * @param {Object} shotData - Shot parameters
     * @param {number} shotData.distance - Distance to goal in meters
     * @param {number} shotData.angle - Angle to goal in degrees
     * @param {number} shotData.defenderDistance - Distance to nearest defender in meters
     * @returns {Object} Result containing probability and factor breakdown
     */
    function estimateProbability(shotData) {
        const { distance, angle, defenderDistance } = shotData;
        
        // Calculate individual factors
        const distanceFactor = calculateDistanceFactor(distance);
        const angleFactor = calculateAngleFactor(angle);
        const defenderFactor = calculateDefenderFactor(defenderDistance);
        
        // Generate base probability
        const baseProbability = CONFIG.BASE_MIN + 
            (Math.random() * (CONFIG.BASE_MAX - CONFIG.BASE_MIN));
        
        // Combine factors
        let probability = baseProbability 
            * distanceFactor 
            * angleFactor 
            * defenderFactor;
        
        // Add noise
        probability += addNoise();
        
        // Clamp to valid range
        probability = clamp(
            probability, 
            CONFIG.MIN_PROBABILITY, 
            CONFIG.MAX_PROBABILITY
        );
        
        // Return detailed result
        return {
            probability: probability,
            percentage: Math.round(probability * 100),
            factors: {
                base: baseProbability,
                distance: distanceFactor,
                angle: angleFactor,
                defender: defenderFactor
            }
        };
    }
    
    /**
     * Get model configuration (for debugging/display)
     */
    function getConfig() {
        return { ...CONFIG };
    }
    
    // Public API
    return {
        estimateProbability,
        getConfig,
        // Expose individual factor functions for testing
        _calculateDistanceFactor: calculateDistanceFactor,
        _calculateAngleFactor: calculateAngleFactor,
        _calculateDefenderFactor: calculateDefenderFactor
    };
    
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProbabilityModel;
}
