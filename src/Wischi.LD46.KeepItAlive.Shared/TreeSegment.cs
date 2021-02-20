using System.Collections.Generic;

namespace Wischi.LD46.KeepItAlive
{
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
