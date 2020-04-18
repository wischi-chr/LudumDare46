using System;
using System.Collections.Generic;
using System.Text;

namespace Wischi.LD46.KeepItAlive
{

    public class RandomWrapper : IRandomSource
    {
        private readonly Random random;

        public RandomWrapper(Random random)
        {
            this.random = random ?? throw new ArgumentNullException(nameof(random));
        }

        public RandomWrapper()
        {
            random = new Random();
        }

        public double NextDouble()
        {
            return random.NextDouble();
        }
    }

    public interface IRandomSource
    {
        double NextDouble();
    }

    public class TreeBuilder
    {
        private const double TAU = Math.PI * 2;

        private readonly IRandomSource random;

        public TreeBuilder(IRandomSource random)
        {
            this.random = random ?? throw new ArgumentNullException(nameof(random));
        }

        public double TrunkThickness { get; set; } = 0.3;
        public double ProbabilitySingleBranch { get; set; } = 0.1;
        public double BranchThicknessReductionFactor { get; set; } = 0.7;
        public double BranchLengthReductionFactorMin { get; set; } = 0.6;
        public double BranchLengthReductionFactorMax { get; set; } = 0.85;

        public double MaxRotationFactor { get; set; } = 0.05 * TAU;
        public double BranchSpreadMin { get; set; } = 0.1 * TAU;
        public double BranchSpreadMax { get; set; } = 0.2 * TAU;


        public int MaxDepth { get; set; } = 12;

        public TreeSegment BuildTree()
        {
            var trunk = new TreeSegment(TrunkThickness);
            AddBranchesToSegment(trunk, 0.25 * TAU);
            return trunk;
        }

        private void AddBranchesToSegment(TreeSegment segment, double absoluteAngle)
        {
            if (segment.Depth == MaxDepth)
            {
                return;
            }

            if (segment.Thickness < 0.002)
            {
                return;
            }

            const double maxDevAngle = 0.1 * TAU;
            const double gravityNormal = 0.75 * TAU;

            var floatDepth = (double)segment.Depth / MaxDepth;
            var deltaAngle = Math.Atan2(Math.Sin(gravityNormal - absoluteAngle), Math.Cos(gravityNormal - absoluteAngle));

            if (Math.Abs(deltaAngle) < maxDevAngle)
            {
                return;
            }

            var randomDeviationAngle = random.NextDouble() * 2 * MaxRotationFactor - MaxRotationFactor;
            var deviationAngle = BiasedValue(0, randomDeviationAngle, 1);

            var branchingSpread = random.UniformRandom(BranchSpreadMin, BranchSpreadMax);

            if (segment.Depth == 0)
            {
                AddAngledBranch(segment, deviationAngle - branchingSpread / 2, absoluteAngle);
                AddAngledBranch(segment, deviationAngle + branchingSpread / 2, absoluteAngle);
                AddAngledBranch(segment, deviationAngle, absoluteAngle);
            }
            else if (random.NextDouble() <= ProbabilitySingleBranch)
            {
                // no branching
                AddAngledBranch(segment, deviationAngle, absoluteAngle);
            }
            else
            {
                // branching
                var leftAngle = deviationAngle - branchingSpread / 2;
                var rightAngle = deviationAngle + branchingSpread / 2;

                if (random.NextDouble() < 0.8)
                {
                    var rndAngle = random.UniformRandom(deviationAngle - branchingSpread, deviationAngle + branchingSpread);
                    var thickness = random.UniformRandom(0.25, 0.5);
                    AddAngledBranch(segment, rndAngle, absoluteAngle, extraThicknessFactor: thickness);
                }

                AddAngledBranch(segment, leftAngle, absoluteAngle);
                AddAngledBranch(segment, rightAngle, absoluteAngle);
            }
        }

        private double BiasedValue(double valueA, double valueB, double bias)
        {
            return valueB * bias + valueA * (1 - bias);
        }

        private void AddAngledBranch(TreeSegment parent, double deviation, double oldAbsoluteAngle, double extraThicknessFactor = 1)
        {
            var floatDepth = (double)parent.Depth / MaxDepth;

            var lengthFactor = 0.8;

            if (parent.Depth < 3)
            {
                lengthFactor = random.UniformRandom(BranchLengthReductionFactorMin, BranchLengthReductionFactorMax);
            }

            var nextThinckness = parent.Thickness * BranchThicknessReductionFactor * extraThicknessFactor;

            var branch = parent.AddBranch(deviation, parent.Length * lengthFactor, nextThinckness);
            AddBranchesToSegment(branch, oldAbsoluteAngle + deviation);
        }
    }

    public static class RandomExtensions
    {
        public static double UniformRandom(this IRandomSource randomSource, double lowerLimit, double upperLimit)
        {
            var delta = (upperLimit - lowerLimit);
            var randAmount = randomSource.NextDouble() * delta;
            return lowerLimit + randAmount;
        }
    }

    public interface IPixelScreenWriter
    {
        void SetPixel(int x, int y, bool set);
    }

    public struct Vector2d
    {
        public Vector2d(double x, double y)
        {
            X = x;
            Y = y;
        }

        public double X { get; }
        public double Y { get; }
        public double Length => Math.Sqrt(X * X + Y * Y);

        public Vector2d Rotate(double radianAngle)
        {
            var cosAngle = Math.Cos(radianAngle);
            var sinAngle = Math.Sin(radianAngle);

            var x = cosAngle * X - sinAngle * Y;
            var y = sinAngle * X + cosAngle * Y;

            return new Vector2d(x, y);
        }

        public Vector2d ChangeLength(double newLength)
        {
            var len = Length;

            var normalizedX = X / len;
            var normalizedY = Y / len;

            return new Vector2d(normalizedX * newLength, normalizedY * newLength);
        }
    }

    public class TreeSegment
    {
        public TreeSegment(double thickness)
        {
            Depth = 0;
            DeviationAngle = 0;
            Length = 1;

            Branches = new List<TreeSegment>();
            Thickness = thickness;
        }

        private TreeSegment(int depth, double deviationAngle, double length, double thickness)
        {
            Depth = depth;
            DeviationAngle = deviationAngle;
            Length = length;
            Thickness = thickness;
            Branches = new List<TreeSegment>();
        }

        public int Depth { get; }
        public double Thickness { get; }
        public double DeviationAngle { get; }
        public double Length { get; }
        public IList<TreeSegment> Branches { get; }

        public TreeSegment AddBranch(double deviationAngle, double length, double thickness)
        {
            var branch = new TreeSegment(Depth + 1, deviationAngle, length, thickness);
            Branches.Add(branch);
            return branch;
        }
    }
}
