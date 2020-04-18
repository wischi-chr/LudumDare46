using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Wischi.LD46.KeepItAlive.TestRunner
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            var rndSource = new RandomWrapper();
            var treeBuilder = new TreeBuilder(rndSource);
            var tree = treeBuilder.BuildTree();
        }
    }
}
