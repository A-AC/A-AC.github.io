// Get the slider and robot arm elements
const slider = document.getElementById('joint-angle-slider');
const robotArm = document.querySelector('.robot-arm');
const linkContainers = document.querySelectorAll('.link-container')
const endEffector = document.querySelector('.end-effector');

  // Define the initial joint angles
  const initialAngles = [0, 0, 0, 0];

// Function to update the rotation of the robot arm
function updateRotation() {
  const angle = +slider.value;
  let totAngle = angle;
  let prevX = 0;
  let prevY = 0;

    linkContainers.forEach((container, index) => {
      //const angle = calculateJointAngle(index);

      // Update the position and rotation of the link container
      container.style.transform = `translate(${prevX}px, ${prevY}px) rotate(${totAngle}deg)`;

      // Update the variables for the next iteration
      const linkLength = 120;
      const offsetX = linkLength * Math.cos((totAngle * Math.PI) / 180);
      const offsetY = linkLength * Math.sin((totAngle * Math.PI) / 180);
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


// Attach an event listener to the slider
slider.addEventListener('input', updateRotation);

// Call the updateRotation function initially to set the default rotation
updateRotation();
