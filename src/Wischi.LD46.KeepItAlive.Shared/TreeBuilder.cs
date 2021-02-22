using System;

namespace Wischi.LD46.KeepItAlive
{
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
}
