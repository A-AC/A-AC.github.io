// Get the slider and robot arm elements
const slider = document.getElementById('joint-angle-slider');
const robotArm = document.querySelector('.robot-arm');
const linkContainers = document.querySelectorAll('.link-container')
const endEffector = document.querySelector('.end-effector');

  // Define the initial joint angles
  const initialAngles = [0, 0, 0, 0];

// Function to update the rotation of the robot arm
function updateRotation(mouseX, mouseY) {
  const robotRect = robotArm.getBoundingClientRect();
  const X = (mouseX - robotRect.left - robotRect.width/2);
  const Y = (mouseY - robotRect.top - robotRect.height/2);
  const linkLength = a = 120;
  console.log(X, Y);

  let angle = 0;
  let totAngle = angle;
  let prevX = 200;
  let prevY = 200;

  let angle2 = Math.acos((X*X + Y*Y - a*a - a*a)/(2*a*a));
  let angle1 = Math.atan(Y/X) - Math.atan((a*Math.sin(angle2))/(a+a*Math.cos(angle2)));
  console.log(angle1 * (180 / Math.PI), angle2 * (180 / Math.PI))
  
  linkContainers.forEach((container, index) => {
    //const angle = calculateJointAngle(index);
    if (index == 1){
      angle = angle2 * (180 / Math.PI) + angle1 * (180 / Math.PI);

    } else if (index== 0){
      angle = angle1 * (180 / Math.PI);
    }
    
    // Check for negatives
    if (X < 0 ){
      angle -= 180;
    }

    // Update the position and rotation of the link container
    container.style.transform = `translate(${prevX}px, ${prevY}px) rotate(${angle}deg)`;

    // Update the variables for the next iteration
    const offsetX = linkLength * Math.cos((angle * Math.PI) / 180);
    const offsetY = linkLength * Math.sin((angle * Math.PI) / 180);
    prevX += offsetX;
    prevY += offsetY;
      totAngle += angle;
  });

}

  // Function to calculate the angle of a joint
  function calculateJointAngle(index) {
    let angle = 0;
    for (let i = 0; i <= index; i++) {
      angle += initialAngles[i];
    }
    return angle;
  }
  
    // Update the position and rotation of the robot arm
    updateRotation();

// Event listener to track mouse movement and update joint angles
robotArm.addEventListener('mousemove', (event) => {
  updateRotation(event.clientX, event.clientY);
});
// Attach an event listener to the slider
slider.addEventListener('input', updateRotation);

// Call the updateRotation function initially to set the default rotation
updateRotation();
