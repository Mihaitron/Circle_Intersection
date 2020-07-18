function setup()
{
  createCanvas(500, 500);
  background(0);
  
  // Set boundary length
  let boundary_length = height / 4;
  
  // Create any number of circles, minimum of 1
  let circles = [];
  
  // let circle = new Circle(x_position, y_position, radius);
  let cir1 = new Circle(width / 4, height / 2, boundary_length / 2);
  let cir2 = new Circle(cir1.getX() * 1.5, height * 2 / 3, boundary_length / 2);
  
  // Put the circles in a list
  circles.push(cir1);
  circles.push(cir2);
  
  // Create one boundary
  let boundary = new Square(cir1.getX(), cir1.getY(), boundary_length);
  // Set the depth
  let depth = 4;
  // Create the QuadTree using the boundary, depth and the list of circles
  let qtree = new QuadTree(boundary, depth, circles);
  
  // Show the circles
  noFill();
  stroke(255);
  circle(cir1.getX(), cir1.getY(), boundary_length / 2);
  circle(cir2.getX(), cir2.getY(), boundary_length / 2);
  
  // Get the estimated area of the intersection of the 1st circle in the list
  // with the other circle in the list (also show the QuadTree)
  let estimated_area = qtree.subdivide();
  
  // Show the estimated area
  print(estimated_area);
  textSize(25);
  fill(255);
  text("Area:", width / 5, height / 4);
  fill(0, 225, 0);
  stroke(0);
  text(nf(estimated_area, 0, 2), width / 5, height / 3  );
}
