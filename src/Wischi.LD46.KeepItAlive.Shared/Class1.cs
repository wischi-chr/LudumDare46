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
        public double ProbabilitySingleBranch { get; set; } = 0.0;
        public double BranchThicknessReductionFactor { get; set; } = 0.7;
        public double BranchLengthReductionFactor { get; set; } = 0.8;

        /// <summary>
        /// Rotation factor is in unit tau (2*pi)
        /// </summary>
        public double MaxRotationFactor { get; set; } = 0.1;

        /// <summary>
        /// Spread angle (unit Tau)
        /// </summary>
        public double BranchSpreadMin { get; set; } = 0.1;

        public double BranchSpreadMax { get; set; } = 0.2;

        public int Depth { get; set; } = 12;

        public TreeSegment BuildTree()
        {
            var trunk = new TreeSegment(TrunkThickness);
            AddBranchesToSegment(trunk);
            return trunk;
        }

        private void AddBranchesToSegment(TreeSegment segment)
        {
            if (segment.Depth == Depth)
            {
                return;
            }

            var deltaRotation = 0;// random.NextDouble() * 2 * MaxRotationFactor - MaxRotationFactor;
            var nextLength = segment.Vector.Length * BranchLengthReductionFactor;
            var nextVector = segment.Vector.Rotate(deltaRotation * TAU).ChangeLength(nextLength);
            var nextThinckness = segment.Thickness * BranchThicknessReductionFactor;

            if (random.NextDouble() <= ProbabilitySingleBranch)
            {
                // no branching
                var newBranch = segment.AddBranch(nextVector, nextThinckness);
                AddBranchesToSegment(newBranch);
            }
            else
            {
                // branching

                var delta = (BranchSpreadMax - BranchSpreadMin);
                var randomDelta = random.NextDouble() * delta;
                var spread = BranchSpreadMin + randomDelta;

                var branchAVector = nextVector.Rotate(-spread / 2 * TAU);
                var branchBVector = nextVector.Rotate(+spread / 2 * TAU);

                var branchA = segment.AddBranch(branchAVector, nextThinckness);
                var branchB = segment.AddBranch(branchBVector, nextThinckness);

                AddBranchesToSegment(branchA);
                AddBranchesToSegment(branchB);
            }
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
            Vector = new Vector2d(0, 1);
            Branches = new List<TreeSegment>();
            Thickness = thickness;
        }

        private TreeSegment(int depth, Vector2d vector, double thickness)
        {
            Depth = depth;
            Vector = vector;
            Thickness = thickness;
            Branches = new List<TreeSegment>();
        }

        public int Depth { get; }
        public double Thickness { get; }
        public Vector2d Vector { get; }
        public IList<TreeSegment> Branches { get; }

        public TreeSegment AddBranch(Vector2d vector, double thickness)
        {
            var branch = new TreeSegment(Depth + 1, vector, thickness);
            Branches.Add(branch);
            return branch;
        }
    }
}
