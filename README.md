# Maze Generation + Breadth-First Search + Genetic Algorithm

This program has three sections.

1. Maze generation:
Initially, the program runs a maze generation algorithm. This algorithm
can be read on Wikipedia here:
https://en.wikipedia.org/wiki/Maze_generation_algorithm

2. Breadth-First Search:
After that, a breadth-first search is run to find the shortest path from the
start (top left corner) to the end (bottom right corner).

3. Genetic Algorithm:
Then, a population of "vehicles" is created. Every vehicle is given a unique
DNA. This DNA is just a set of directions for the vehicle to navigate the maze.
The vehicle dies as soon as it hits a wall.
Then all the vehicles are run and their fitness is calculated. The fitness function
is calculated by comparing all directions in DNA to the correct directions
calculated by the breadth-first search. Then, the max-distance the vehicles travels
is multiplied by 2 (arbitrary) and added to fitness.
Then the standard GA is run on the population, and a new population is created.

TODO:
Some optimizations are needed as well as interface. The process takes too long to
run. I am going to change it to only show the most successful vehicle of every
generation.

NEED TO fix local maxima. Doesn't work properly yet. All help would be appreciated.
