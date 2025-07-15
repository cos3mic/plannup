import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Modal, ScrollView } from 'react-native';
import { useIdeas } from '../../components/IdeaContext';
import { Ionicons } from '@expo/vector-icons';

export default function IdeasScreen() {
  const { ideas, addIdea, upvoteIdea, addComment, togglePromoteIdea, updateComment } = useIdeas();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  const userEmail = useIdeas().userEmail || 'anonymous';

  const selectedIdea = ideas.find(i => i.id === selectedIdeaId) || null;

  const handleAddIdea = () => {
    if (title.trim() && description.trim()) {
      addIdea(title, description);
      setTitle('');
      setDescription('');
      setModalVisible(false);
    }
  };

  const handleAddComment = (ideaId) => {
    if (comment.trim()) {
      addComment(ideaId, userEmail, comment);
      setComment('');
    }
  };

  const handleEditComment = (commentId, text) => {
    setEditingCommentId(commentId);
    setEditingCommentText(text);
  };

  const handleSaveComment = (ideaId, commentId) => {
    if (editingCommentText.trim()) {
      updateComment(ideaId, commentId, editingCommentText);
      setEditingCommentId(null);
      setEditingCommentText('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  const renderIdea = ({ item }) => (
    <TouchableOpacity style={styles.ideaCard} onPress={() => setSelectedIdeaId(item.id)}>
      <View style={styles.ideaHeader}>
        <Text style={styles.ideaTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => upvoteIdea(item.id)} style={styles.upvoteBtn}>
          <Ionicons name="arrow-up" size={20} color="#FF6B6B" />
          <Text style={styles.upvoteCount}>{item.upvotes}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.ideaDesc}>{item.description}</Text>
      <Text style={styles.ideaStatus}>Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Idea Incubator</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={ideas}
        renderItem={renderIdea}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      {/* Add Idea Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Submit a New Idea</Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, { height: 80 }]}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddIdea} style={styles.submitBtn}>
                <Text style={styles.submitText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Idea Details Modal */}
      <Modal visible={!!selectedIdea} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '80%' }]}> 
            <ScrollView>
              {selectedIdea ? (
                <>
                  <Text style={styles.modalTitle}>{selectedIdea.title}</Text>
                  <Text style={styles.ideaDesc}>{selectedIdea.description}</Text>
                  <Text style={styles.ideaStatus}>Status: {selectedIdea.status}</Text>
                  <Text style={styles.ideaStatus}>Promotes: {selectedIdea.promotedBy.length}</Text>
                  <Text style={styles.sectionTitle}>Comments</Text>
                  {selectedIdea.comments.length ? (
                    selectedIdea.comments.map(c => (
                      <View key={c.id} style={styles.comment}>
                        <Text style={styles.commentAuthor}>{c.author}:</Text>
                        {editingCommentId === c.id ? (
                          <>
                            <TextInput
                              value={editingCommentText}
                              onChangeText={setEditingCommentText}
                              style={[styles.input, { flex: 1, marginBottom: 0 }]}
                            />
                            <TouchableOpacity onPress={() => handleSaveComment(selectedIdea.id, c.id)} style={styles.submitBtn}>
                              <Text style={styles.submitText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelBtn}>
                              <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <>
                            <Text style={styles.commentText}>{c.text}</Text>
                            {c.author === userEmail && (
                              <TouchableOpacity onPress={() => handleEditComment(c.id, c.text)} style={{ marginLeft: 8 }}>
                                <Ionicons name="pencil" size={16} color="#0a7ea4" />
                              </TouchableOpacity>
                            )}
                          </>
                        )}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noComments}>No comments yet.</Text>
                  )}
                  <TextInput
                    placeholder="Add a comment..."
                    value={comment}
                    onChangeText={setComment}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={() => handleAddComment(selectedIdea.id)} style={styles.submitBtn}>
                    <Text style={styles.submitText}>Comment</Text>
                  </TouchableOpacity>
                  {/* Promote/Unpromote Button */}
                  <TouchableOpacity
                    onPress={() => togglePromoteIdea(selectedIdea.id)}
                    style={styles.promoteBtn}
                  >
                    <Ionicons name="rocket" size={18} color="#fff" />
                    <Text style={styles.promoteText}>
                      {selectedIdea.promotedBy.includes(userEmail) ? 'Unpromote' : 'Promote to Project/Issue'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setSelectedIdeaId(null)} style={styles.cancelBtn}>
                    <Text style={styles.cancelText}>Close</Text>
                  </TouchableOpacity>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold' },
  addBtn: { backgroundColor: '#FF6B6B', borderRadius: 22, width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  list: { padding: 20 },
  ideaCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  ideaHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ideaTitle: { fontSize: 18, fontWeight: '600', flex: 1 },
  upvoteBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  upvoteCount: { marginLeft: 4, fontWeight: 'bold', color: '#FF6B6B' },
  ideaDesc: { marginTop: 8, fontSize: 15, color: '#444' },
  ideaStatus: { marginTop: 4, fontSize: 13, color: '#888' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '90%' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: '#fafafa' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  cancelBtn: { padding: 10 },
  cancelText: { color: '#888', fontWeight: 'bold' },
  submitBtn: { backgroundColor: '#0a7ea4', borderRadius: 8, padding: 10, alignItems: 'center', marginTop: 4 },
  submitText: { color: '#fff', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 6 },
  comment: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  commentAuthor: { fontWeight: 'bold', marginRight: 4 },
  commentText: { color: '#444' },
  noComments: { color: '#aaa', fontStyle: 'italic', marginBottom: 8 },
  promoteBtn: { backgroundColor: '#FF6B6B', borderRadius: 8, padding: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  promoteText: { color: '#fff', fontWeight: 'bold', marginLeft: 6 },
}); 