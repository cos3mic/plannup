import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
// import DraggableFlatList from 'react-native-draggable-flatlist'; // Uncomment if installed
import { Ionicons } from '@expo/vector-icons';

const STATUS_COLUMNS = [
  { key: 'To Do', color: '#E5E5E5' },
  { key: 'In Progress', color: '#FF6B6B' },
  { key: 'Done', color: '#4ECDC4' },
];

export default function KanbanBoard({ issues, onUpdateIssue }) {
  // Group issues by status
  const grouped = STATUS_COLUMNS.map(col => ({
    ...col,
    issues: issues.filter(issue => issue.status === col.key),
  }));

  // For demo, drag-and-drop is not implemented unless DraggableFlatList is installed
  // You can add drag-and-drop with react-native-draggable-flatlist or similar

  return (
    <View style={styles.board}>
      {grouped.map(column => (
        <View key={column.key} style={styles.column}>
          <View style={[styles.columnHeader, { backgroundColor: column.color }]}> 
            <Text style={styles.columnTitle}>{column.key}</Text>
          </View>
          <FlatList
            data={column.issues}
            keyExtractor={item => item.id}
            style={styles.issuesList}
            contentContainerStyle={{ padding: 8 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMeta}>{item.key} • {item.type} • {item.priority}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardAssignee}>{item.assignee}</Text>
                  <TouchableOpacity
                    style={styles.moveBtn}
                    onPress={() => {
                      // Move to next status
                      const nextIdx = STATUS_COLUMNS.findIndex(c => c.key === item.status) + 1;
                      if (nextIdx < STATUS_COLUMNS.length) {
                        onUpdateIssue(item.id, { status: STATUS_COLUMNS[nextIdx].key });
                      }
                    }}
                    disabled={item.status === 'Done'}
                  >
                    <Ionicons name="arrow-forward-circle" size={20} color={item.status === 'Done' ? '#ccc' : '#0a7ea4'} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    flex: 1,
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    minWidth: 120,
    maxWidth: 320,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
  },
  columnHeader: {
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  columnTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  issuesList: {
    minHeight: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardAssignee: {
    fontSize: 12,
    color: '#0a7ea4',
    fontWeight: 'bold',
  },
  moveBtn: {
    marginLeft: 8,
  },
}); 