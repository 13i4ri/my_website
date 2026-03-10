/**
 * Court Renderer for Handball Shot Simulator
 * 
 * Responsible for drawing the handball court using HTML5 Canvas.
 * Renders a half-court view with goal, 6m line, 9m line, and other markings.
 */

const CourtRenderer = (function() {
    
    /**
     * Court configuration and colors
     */
    const COLORS = {
        floor: '#E8A45C',           // Light orange court floor
        lines: '#FFFFFF',            // White lines
        goal: '#8B0000',             // Dark red goal
        goalNet: '#CCCCCC',          // Light gray for net pattern
        sixMeterArea: '#D4935A',     // Slightly darker for 6m area
        shotMarker: '#FF3B3B',       // Red shot marker
        shotMarkerBorder: '#FFFFFF'  // White border for visibility
    };
    
    /**
     * Court dimensions (scaled to canvas)
     * Real handball court: 40m x 20m (half: 20m x 20m)
     * We'll use approximate proportions for visual appeal
     */
    const DIMENSIONS = {
        // These are ratios relative to canvas size
        goalWidth: 0.15,        // Goal is ~3m on 20m width = 15%
        goalHeight: 0.05,       // Visual height of goal
        sixMeterRadius: 0.3,    // 6m line radius (scaled)
        nineMeterRadius: 0.45,  // 9m line radius (scaled)
        lineWidth: 2,
        shotMarkerRadius: 6
    };
    
    let canvas = null;
    let ctx = null;
    let currentShotPosition = null;
    
    /**
     * Initialize the renderer with a canvas element
     * 
     * @param {HTMLCanvasElement} canvasElement - The canvas to render on
     */
    function init(canvasElement) {
        canvas = canvasElement;
        ctx = canvas.getContext('2d');
        render();
    }
    
    /**
     * Get canvas dimensions
     */
    function getCanvasSize() {
        return {
            width: canvas.width,
            height: canvas.height
        };
    }
    
    /**
     * Get goal position (center of goal)
     */
    function getGoalPosition() {
        return {
            x: canvas.width / 2,
            y: 0
        };
    }
    
    /**
     * Convert canvas coordinates to court coordinates (meters)
     * Assumes canvas represents roughly 20m x 10m of court
     * 
     * @param {number} canvasX - X position on canvas
     * @param {number} canvasY - Y position on canvas
     * @returns {Object} Court coordinates in meters
     */
    function canvasToCourtCoordinates(canvasX, canvasY) {
        const scaleX = 20 / canvas.width;   // 20 meters width
        const scaleY = 10 / canvas.height;  // 10 meters depth (half court)
        
        return {
            x: (canvasX - canvas.width / 2) * scaleX,  // Center origin
            y: canvasY * scaleY
        };
    }
    
    /**
     * Draw the court floor
     */
    function drawFloor() {
        ctx.fillStyle = COLORS.floor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    /**
     * Draw the 6-meter (goal area) line - semicircle
     */
    function drawSixMeterLine() {
        const centerX = canvas.width / 2;
        const centerY = 0;
        const radius = canvas.height * DIMENSIONS.sixMeterRadius;
        
        // Fill the 6m area with slightly different color
        ctx.fillStyle = COLORS.sixMeterArea;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI, false);
        ctx.fill();
        
        // Draw the line
        ctx.strokeStyle = COLORS.lines;
        ctx.lineWidth = DIMENSIONS.lineWidth;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI, false);
        ctx.stroke();
    }
    
    /**
     * Draw the 9-meter (free throw) line - dashed semicircle
     */
    function drawNineMeterLine() {
        const centerX = canvas.width / 2;
        const centerY = 0;
        const radius = canvas.height * DIMENSIONS.nineMeterRadius;
        
        ctx.strokeStyle = COLORS.lines;
        ctx.lineWidth = DIMENSIONS.lineWidth;
        ctx.setLineDash([10, 5]);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI, false);
        ctx.stroke();
        
        ctx.setLineDash([]);  // Reset to solid line
    }
    
    /**
     * Draw the goal
     */
    function drawGoal() {
        const goalWidth = canvas.width * DIMENSIONS.goalWidth;
        const goalHeight = canvas.height * DIMENSIONS.goalHeight;
        const goalX = (canvas.width - goalWidth) / 2;
        const goalY = 0;
        
        // Goal frame
        ctx.fillStyle = COLORS.goal;
        ctx.fillRect(goalX, goalY, goalWidth, goalHeight);
        
        // Goal posts (side lines)
        ctx.strokeStyle = COLORS.goal;
        ctx.lineWidth = 4;
        
        // Left post
        ctx.beginPath();
        ctx.moveTo(goalX, goalY);
        ctx.lineTo(goalX, goalY + goalHeight + 10);
        ctx.stroke();
        
        // Right post
        ctx.beginPath();
        ctx.moveTo(goalX + goalWidth, goalY);
        ctx.lineTo(goalX + goalWidth, goalY + goalHeight + 10);
        ctx.stroke();
        
        // Net pattern (simple lines)
        ctx.strokeStyle = COLORS.goalNet;
        ctx.lineWidth = 1;
        
        const netSpacing = 8;
        for (let x = goalX + netSpacing; x < goalX + goalWidth; x += netSpacing) {
            ctx.beginPath();
            ctx.moveTo(x, goalY);
            ctx.lineTo(x, goalY + goalHeight);
            ctx.stroke();
        }
    }
    
    /**
     * Draw the goal line (top of court)
     */
    function drawGoalLine() {
        ctx.strokeStyle = COLORS.lines;
        ctx.lineWidth = DIMENSIONS.lineWidth;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvas.width, 0);
        ctx.stroke();
    }
    
    /**
     * Draw the center line (bottom of half court)
     */
    function drawCenterLine() {
        ctx.strokeStyle = COLORS.lines;
        ctx.lineWidth = DIMENSIONS.lineWidth;
        
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();
    }
    
    /**
     * Draw side lines
     */
    function drawSideLines() {
        ctx.strokeStyle = COLORS.lines;
        ctx.lineWidth = DIMENSIONS.lineWidth;
        
        // Left side
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, canvas.height);
        ctx.stroke();
        
        // Right side
        ctx.beginPath();
        ctx.moveTo(canvas.width, 0);
        ctx.lineTo(canvas.width, canvas.height);
        ctx.stroke();
    }
    
    /**
     * Draw the 7-meter penalty line
     */
    function drawSevenMeterLine() {
        const centerX = canvas.width / 2;
        const lineY = canvas.height * 0.35;  // 7m position (scaled)
        const lineHalfWidth = 15;
        
        ctx.strokeStyle = COLORS.lines;
        ctx.lineWidth = DIMENSIONS.lineWidth;
        
        ctx.beginPath();
        ctx.moveTo(centerX - lineHalfWidth, lineY);
        ctx.lineTo(centerX + lineHalfWidth, lineY);
        ctx.stroke();
    }
    
    /**
     * Draw the goalkeeper's restraining line (4m)
     */
    function drawFourMeterLine() {
        const centerX = canvas.width / 2;
        const lineY = canvas.height * 0.2;  // 4m position (scaled)
        const lineHalfWidth = 8;
        
        ctx.strokeStyle = COLORS.lines;
        ctx.lineWidth = DIMENSIONS.lineWidth;
        
        ctx.beginPath();
        ctx.moveTo(centerX - lineHalfWidth, lineY);
        ctx.lineTo(centerX + lineHalfWidth, lineY);
        ctx.stroke();
    }
    
    /**
     * Draw the shot position marker
     * 
     * @param {number} x - X position on canvas
     * @param {number} y - Y position on canvas
     */
    function drawShotMarker(x, y) {
        const radius = DIMENSIONS.shotMarkerRadius;
        
        // Outer glow
        ctx.beginPath();
        ctx.arc(x, y, radius + 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 59, 59, 0.3)';
        ctx.fill();
        
        // White border
        ctx.beginPath();
        ctx.arc(x, y, radius + 1, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.shotMarkerBorder;
        ctx.fill();
        
        // Red center
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = COLORS.shotMarker;
        ctx.fill();
    }
    
    /**
     * Draw a line from shot position to goal center
     * 
     * @param {number} x - Shot X position
     * @param {number} y - Shot Y position
     */
    function drawShotLine(x, y) {
        const goalCenter = getGoalPosition();
        
        ctx.strokeStyle = 'rgba(255, 59, 59, 0.4)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(goalCenter.x, goalCenter.y);
        ctx.stroke();
        
        ctx.setLineDash([]);
    }
    
    /**
     * Set the current shot position
     * 
     * @param {number} x - X position on canvas
     * @param {number} y - Y position on canvas
     */
    function setShotPosition(x, y) {
        currentShotPosition = { x, y };
        render();
    }
    
    /**
     * Clear the current shot position
     */
    function clearShotPosition() {
        currentShotPosition = null;
        render();
    }
    
    /**
     * Render the complete court
     */
    function render() {
        if (!ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw court elements in order
        drawFloor();
        drawSixMeterLine();
        drawNineMeterLine();
        drawGoalLine();
        drawCenterLine();
        drawSideLines();
        drawSevenMeterLine();
        drawFourMeterLine();
        drawGoal();
        
        // Draw shot marker if position is set
        if (currentShotPosition) {
            drawShotLine(currentShotPosition.x, currentShotPosition.y);
            drawShotMarker(currentShotPosition.x, currentShotPosition.y);
        }
    }
    
    // Public API
    return {
        init,
        render,
        setShotPosition,
        clearShotPosition,
        getCanvasSize,
        getGoalPosition,
        canvasToCourtCoordinates
    };
    
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CourtRenderer;
}
