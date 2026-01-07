/**
 * DatabaseViewer Component

 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useEffect  } from 'https://esm.sh/react@18';
import { Database, Table, Columns, Key, X, RefreshCw, Loader2, Eye, EyeOff } from 'lucide-react';


interface TableInfo {
  table_name: string;
  table_type: string;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
}

interface TableData {
  table: TableInfo;
  columns: ColumnInfo[];
  rowCount?: number;
}

interface DatabaseViewerProps {
  isOpen: boolean;
  onClose: () => void;
  appId?: string;
}

export default function DatabaseViewer: React.FC<DatabaseViewerProps> = ({
  isOpen,
  onClose,
  appId,
}) => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      loadDatabaseSchema();
    }
  }, [isOpen, appId]);

  const loadDatabaseSchema = async () => {
    setLoading(true);
    try {
      // Get all tables in public schema
      const { data: tablesData, error: tablesError } = await supabase
        .rpc('get_tables_info')
        .select('*')
        .limit(100);

      // Fallback: Try direct query if RPC doesn't exist
      let tablesList: TableInfo[] = [];
      
      if (tablesError || !tablesData) {
        // Try alternative approach - list tables from apps table structure
        // This is a simplified approach since we can't directly query information_schema
        // In production, you'd want to create a proper RPC function
        
        // For now, show known tables based on app structure
        tablesList = [
          { table_name: 'apps', table_type: 'BASE TABLE' },
          { table_name: 'projects', table_type: 'BASE TABLE' },
          { table_name: 'tasks', table_type: 'BASE TABLE' },
          { table_name: 'task_groups', table_type: 'BASE TABLE' },
          { table_name: 'task_runs', table_type: 'BASE TABLE' },
          { table_name: 'app_shares', table_type: 'BASE TABLE' },
          { table_name: 'app_edits', table_type: 'BASE TABLE' },
          { table_name: 'app_collaborators', table_type: 'BASE TABLE' },
          { table_name: 'change_log_entries', table_type: 'BASE TABLE' },
        ];
      } else {
        tablesList = tablesData as TableInfo[];
      }

      // For each table, get column information
      const tablesWithColumns: TableData[] = [];
      
      for (const table of tablesList) {
        try {
          // Try to get a sample row to infer structure
          const { data: sampleData, error: sampleError } = await supabase
            .from(table.table_name)
            .select('*')
            .limit(1);

          // Get row count
          const { count } = await supabase
            .from(table.table_name)
            .select('*', { count: 'exact', head: true });

          // Infer columns from sample data or use known structure
          const columns: ColumnInfo[] = [];
          
          if (sampleData && sampleData.length > 0) {
            Object.keys(sampleData[0]).forEach(key => {
              const value = sampleData[0][key];
              columns.push({
                column_name: key,
                data_type: typeof value === 'string' ? 'text' : typeof value === 'number' ? 'integer' : 'jsonb',
                is_nullable: value === null ? 'YES' : 'NO',
                column_default: null,
                character_maximum_length: typeof value === 'string' ? value.length : null,
              });
            });
          }

          tablesWithColumns.push({
            table,
            columns,
            rowCount: count || 0,
          });
        } catch (e) {
          // Skip tables we can't access
          console.warn(`Could not load table ${table.table_name}:`, e);
        }
      }

      setTables(tablesWithColumns);
    } catch (error) {
      console.error('Failed to load database schema:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTableData = async (tableName: string) => {
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(100); // Limit to 100 rows for performance

      if (error) throw error;
      setTableData(data || []);
    } catch (error) {
      console.error(`Failed to load data from ${tableName}:`, error);
      setTableData([]);
    } finally {
      setLoadingData(false);
    }
  };

  const toggleTable = (tableName: string) => {
    if (expandedTables.has(tableName)) {
      setExpandedTables(prev => {
        const newSet = new Set(prev);
        newSet.delete(tableName);
        return newSet;
      });
      setSelectedTable(null);
      setTableData([]);
    } else {
      setExpandedTables(prev => new Set(prev).add(tableName));
      setSelectedTable(tableName);
      loadTableData(tableName);
    }
  };

  if (!isOpen) return null;

  return createElement('div', {className: 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm'}, '<div className="bg-[#111114] border border-white/10 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              createElement('Database', {className: 'text-cyan-400'})
            </div>
            <div>
              createElement('h2', {className: 'text-lg font-bold text-white'}, 'Database Viewer')
              createElement('p', {className: 'text-xs text-slate-400'}, 'View your app's database schema and data')
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadDatabaseSchema}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
              title="Refresh"
            >
              createElement('RefreshCw', null)
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              createElement('X', null)
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Tables List */}
          <div className="w-64 border-r border-white/10 bg-black/40 overflow-y-auto shrink-0">
            <div className="p-4">
              createElement('h3', {className: 'text-xs font-bold text-slate-400 uppercase mb-3'}, 'Tables')
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  createElement('Loader2', {className: 'animate-spin text-slate-500'})') : tables.length === 0 ? (
                createElement('p', {className: 'text-xs text-slate-500'}, 'No tables found')
              ) : (
                <div className="space-y-1">
                  {tables.map(({ table, rowCount }) => (
                    <button
                      key={table.table_name}
                      onClick={() => toggleTable(table.table_name)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                        expandedTables.has(table.table_name)
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        createElement('Table', null)
                        createElement('span', {className: 'truncate'}, '{table.table_name}')
                      </div>
                      {rowCount !== undefined && (
                        createElement('span', {className: 'text-[10px] text-slate-500 ml-2 shrink-0'}, '{rowCount}')
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table Details */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedTable ? (
              <div className="space-y-4">
                {loadingData ? (
                  <div className="flex items-center justify-center py-12">
                    createElement('Loader2', {className: 'animate-spin text-indigo-400'})
                  </div>
                ) : (
                  <>
                    {/* Schema */}
                    <div>
                      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        createElement('Columns', null)
                        Schema: {selectedTable}
                      </h3>
                      <div className="bg-black/40 rounded-lg border border-white/5 overflow-hidden">
                        <table className="w-full text-xs">
                          <thead className="bg-white/5">
                            <tr>
                              createElement('th', {className: 'px-3 py-2 text-left text-slate-400 font-semibold'}, 'Column')
                              createElement('th', {className: 'px-3 py-2 text-left text-slate-400 font-semibold'}, 'Type')
                              createElement('th', {className: 'px-3 py-2 text-left text-slate-400 font-semibold'}, 'Nullable')
                              createElement('th', {className: 'px-3 py-2 text-left text-slate-400 font-semibold'}, 'Default')
                            </tr>
                          </thead>
                          <tbody>
                            {tables.find(t => t.table.table_name === selectedTable)?.columns.map((col, idx) => (
                              <tr key={idx} className="border-t border-white/5">
                                createElement('td', {className: 'px-3 py-2 text-slate-300 font-mono'}, '{col.column_name}')
                                createElement('td', {className: 'px-3 py-2 text-slate-400'}, '{col.data_type}')
                                createElement('td', {className: 'px-3 py-2 text-slate-400'}, '{col.is_nullable}')
                                createElement('td', {className: 'px-3 py-2 text-slate-500'}, '{col.column_default || '-'}')
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Data Preview */}
                    <div>
                      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                        createElement('Eye', null)
                        Data Preview (first 100 rows)
                      </h3>
                      {tableData.length === 0 ? (
                        <div className="bg-black/40 rounded-lg border border-white/5 p-8 text-center">
                          createElement('p', {className: 'text-xs text-slate-500'}, 'No data in this table')
                        </div>
                      ) : (
                        <div className="bg-black/40 rounded-lg border border-white/5 overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead className="bg-white/5">
                              <tr>
                                {Object.keys(tableData[0] || {}).map((key) => (
                                  createElement('th', {className: 'px-3 py-2 text-left text-slate-400 font-semibold'}, '{key}')
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {tableData.map((row, idx) => (
                                <tr key={idx} className="border-t border-white/5">
                                  {Object.values(row).map((value: any, colIdx) => (
                                    createElement('td', {className: 'px-3 py-2 text-slate-300 max-w-xs truncate'}, '{typeof value === 'object' ? JSON.stringify(value) : String(value)}')
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                <div className="text-center">
                  createElement('Database', {className: 'mx-auto mb-4 opacity-50'})
                  createElement('p', {className: 'text-sm'}, 'Select a table to view schema and data')
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

