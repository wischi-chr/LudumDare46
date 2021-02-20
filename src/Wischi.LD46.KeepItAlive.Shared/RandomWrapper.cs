using System;
using System.Collections.Generic;
using System.Text;

namespace Wischi.LD46.KeepItAlive
{
    public class RandomWrapper : IRandomSource
    {
        private Random random;
        private readonly int seed;

        public RandomWrapper(int seed)
        {
            this.seed = seed;
            Reset();
        }

        public void Reset()
        {
            random = new Random(seed);
        }

        public double NextDouble()
        {
            return random.NextDouble();
        }
    }
}
