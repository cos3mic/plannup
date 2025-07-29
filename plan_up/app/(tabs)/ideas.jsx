import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  StyleSheet, 
  ScrollView,
  Alert,
  useColorScheme 
} from 'react-native';
import { useIdeas } from '../../components/IdeaContext';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors.jsx';
import { useTheme } from '../../hooks/useTheme';

export default function IdeasScreen() {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  const { ideas, addIdea, upvoteIdea, addComment, togglePromoteIdea, updateComment } = useIdeas();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('feature');
  const [tags, setTags] = useState('');
  const [impact, setImpact] = useState('medium');
  const [selectedIdeaId, setSelectedIdeaId] = useState(null);
  const [comment, setComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const userEmail = useIdeas().userEmail || 'anonymous';

  const selectedIdea = ideas.find(i => i.id === selectedIdeaId) || null;

  const categories = [
    { key: 'feature', label: 'Feature Request', icon: 'star', color: colors.blue },
    { key: 'improvement', label: 'Improvement', icon: 'construct', color: colors.success },
    { key: 'bug', label: 'Bug Fix', icon: 'bug', color: colors.error },
    { key: 'innovation', label: 'Innovation', icon: 'bulb', color: colors.warning },
  ];

  const impactLevels = [
    { key: 'low', label: 'Low', color: colors.textSecondary },
    { key: 'medium', label: 'Medium', color: colors.blue },
    { key: 'high', label: 'High', color: colors.success },
    { key: 'critical', label: 'Critical', color: colors.error },
  ];

  const tabs = [
    { key: 'all', label: 'All Ideas', icon: 'grid' },
    { key: 'feature', label: 'Features', icon: 'star' },
    { key: 'improvement', label: 'Improvements', icon: 'construct' },
    { key: 'promoted', label: 'Promoted', icon: 'rocket' },
    { key: 'my', label: 'My Ideas', icon: 'person' },
  ];

  const handleAddIdea = () => {
    if (title.trim() && description.trim()) {
      const ideaData = {
        title: title.trim(),
        description: description.trim(),
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        impact,
        status: 'submitted',
        submittedBy: userEmail,
        submittedAt: new Date().toISOString(),
      };
      
      addIdea(ideaData);
      setTitle('');
      setDescription('');
      setCategory('feature');
      setTags('');
      setImpact('medium');
      setModalVisible(false);
      
      Alert.alert('Success', 'Your idea has been submitted for review!');
    } else {
      Alert.alert('Error', 'Please fill in both title and description.');
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

  const handleUpvote = (ideaId) => {
    upvoteIdea(ideaId);
  };

  const getFilteredIdeas = () => {
    let filtered = ideas;
    
    switch (activeTab) {
      case 'feature':
        filtered = ideas.filter(idea => idea.category === 'feature');
        break;
      case 'improvement':
        filtered = ideas.filter(idea => idea.category === 'improvement');
        break;
      case 'promoted':
        filtered = ideas.filter(idea => idea.promotedBy.length > 0);
        break;
      case 'my':
        filtered = ideas.filter(idea => idea.submittedBy === userEmail);
        break;
      default:
        filtered = ideas;
    }
    
    return filtered.sort((a, b) => b.upvotes - a.upvotes);
  };

  const getImpactColor = (impactLevel) => {
    const impact = impactLevels.find(i => i.key === impactLevel);
    return impact ? impact.color : colors.textSecondary;
  };

  const getCategoryInfo = (categoryKey) => {
    return categories.find(cat => cat.key === categoryKey) || categories[0];
  };

  const getIdeaScore = (idea) => {
    const upvoteScore = idea.upvotes * 10;
    const promoteScore = idea.promotedBy.length * 50;
    const commentScore = idea.comments.length * 15; // Increased comment weight
    return upvoteScore + promoteScore + commentScore;
  };

  const renderIdea = ({ item }) => {
    const categoryInfo = getCategoryInfo(item.category);
    const impactColor = getImpactColor(item.impact);
    const ideaScore = getIdeaScore(item);
    
    return (
      <TouchableOpacity 
        style={[styles.ideaCard, { backgroundColor: colors.white, borderColor: colors.border }]} 
        onPress={() => setSelectedIdeaId(item.id)}
      >
      <View style={styles.ideaHeader}>
          <View style={styles.ideaTitleSection}>
            <Text style={[styles.ideaTitle, { color: colors.text }]}>{item.title}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: categoryInfo.color + '20' }]}>
              <Ionicons name={categoryInfo.icon} size={12} color={categoryInfo.color} />
              <Text style={[styles.categoryText, { color: categoryInfo.color }]}>
                {categoryInfo.label}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => handleUpvote(item.id)} style={styles.upvoteBtn}>
            <Ionicons name="arrow-up" size={20} color={colors.blue} />
            <Text style={[styles.upvoteCount, { color: colors.blue }]}>{item.upvotes}</Text>
        </TouchableOpacity>
      </View>
        
        <Text style={[styles.ideaDesc, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.ideaFooter}>
          <View style={styles.ideaMeta}>
            <View style={[styles.impactBadge, { backgroundColor: impactColor + '20' }]}>
              <Text style={[styles.impactText, { color: impactColor }]}>
                {impactLevels.find(i => i.key === item.impact)?.label} Impact
              </Text>
            </View>
            <Text style={[styles.ideaStatus, { color: colors.textSecondary }]}>
              {item.status}
            </Text>
          </View>
          
          <View style={styles.ideaStats}>
            <View style={styles.statItem}>
              <Ionicons name="chatbubble" size={14} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {item.comments.length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="rocket" size={14} color={colors.blue} />
              <Text style={[styles.statText, { color: colors.blue }]}>
                {item.promotedBy.length}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={14} color={colors.success} />
              <Text style={[styles.statText, { color: colors.success }]}>
                {ideaScore}
              </Text>
            </View>
          </View>
        </View>
        
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.blueLight }]}>
                <Text style={[styles.tagText, { color: colors.blue }]}>#{tag}</Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <Text style={[styles.moreTags, { color: colors.textSecondary }]}>
                +{item.tags.length - 3} more
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderTabButton = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: activeTab === item.key ? colors.blue : colors.white,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setActiveTab(item.key)}
    >
      <Ionicons 
        name={item.icon} 
        size={16} 
        color={activeTab === item.key ? colors.white : colors.textSecondary} 
      />
      <Text style={[
        styles.tabText,
        { color: activeTab === item.key ? colors.white : colors.text }
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Idea Incubator</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Share and collaborate on innovative ideas
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: colors.blue }]} 
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          data={tabs}
          renderItem={renderTabButton}
          keyExtractor={(item) => item.key}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        />
      </View>

      <FlatList
        data={getFilteredIdeas()}
        renderItem={renderIdea}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Add Idea Modal */}
      <View style={[styles.modalOverlay, { display: modalVisible ? 'flex' : 'none' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.white }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Submit a New Idea</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalScroll}>
            <TextInput
              placeholder="Idea title"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            />
            
            <Text style={[styles.inputLabel, { color: colors.text }]}>Category</Text>
            <View style={styles.categoryOptions}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.categoryOption,
                    {
                      backgroundColor: category === cat.key ? cat.color : colors.white,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setCategory(cat.key)}
                >
                  <Ionicons 
                    name={cat.icon} 
                    size={16} 
                    color={category === cat.key ? colors.white : cat.color} 
                  />
                  <Text style={[
                    styles.categoryOptionText,
                    { color: category === cat.key ? colors.white : colors.text }
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Impact Level</Text>
            <View style={styles.impactOptions}>
              {impactLevels.map((level) => (
                <TouchableOpacity
                  key={level.key}
                  style={[
                    styles.impactOption,
                    {
                      backgroundColor: impact === level.key ? level.color : colors.white,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => setImpact(level.key)}
                >
                  <Text style={[
                    styles.impactOptionText,
                    { color: impact === level.key ? colors.white : colors.text }
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Tags (comma separated)"
              placeholderTextColor={colors.textSecondary}
              value={tags}
              onChangeText={setTags}
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            />
            
            <TextInput
              placeholder="Describe your idea..."
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              style={[styles.textArea, { color: colors.text, borderColor: colors.border }]}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </ScrollView>

            <View style={styles.modalActions}>
            <TouchableOpacity 
              onPress={() => setModalVisible(false)} 
              style={[styles.cancelBtn, { borderColor: colors.border }]}
            >
              <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleAddIdea} 
              style={[styles.submitBtn, { backgroundColor: colors.blue }]}
            >
              <Text style={styles.submitText}>Submit Idea</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      {/* Idea Details Modal */}
      {selectedIdea && (
        <View style={[styles.modalOverlay, { display: 'flex' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.white, maxHeight: '80%' }]}>
            <ScrollView>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedIdea.title}</Text>
                <TouchableOpacity onPress={() => setSelectedIdeaId(null)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.ideaDesc, { color: colors.textSecondary }]}>
                {selectedIdea.description}
              </Text>
              
              <View style={styles.ideaDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Category:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {getCategoryInfo(selectedIdea.category).label}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Impact:</Text>
                  <Text style={[styles.detailValue, { color: getImpactColor(selectedIdea.impact) }]}>
                    {impactLevels.find(i => i.key === selectedIdea.impact)?.label}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Status:</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedIdea.status}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Score:</Text>
                  <Text style={[styles.detailValue, { color: colors.success }]}>
                    {getIdeaScore(selectedIdea)}
                  </Text>
                </View>
              </View>

              {selectedIdea.tags && selectedIdea.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {selectedIdea.tags.map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: colors.blueLight }]}>
                      <Text style={[styles.tagText, { color: colors.blue }]}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}

              <Text style={[styles.sectionTitle, { color: colors.text }]}>Comments</Text>
                  {selectedIdea.comments.length ? (
                    selectedIdea.comments.map(c => (
                      <View key={c.id} style={styles.comment}>
                    <Text style={[styles.commentAuthor, { color: colors.text }]}>{c.author}:</Text>
                        {editingCommentId === c.id ? (
                          <>
                            <TextInput
                              value={editingCommentText}
                              onChangeText={setEditingCommentText}
                          style={[styles.input, { color: colors.text, borderColor: colors.border, flex: 1, marginBottom: 0 }]}
                            />
                        <TouchableOpacity onPress={() => handleSaveComment(selectedIdea.id, c.id)} style={[styles.submitBtn, { backgroundColor: colors.blue }]}>
                              <Text style={styles.submitText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelBtn}>
                          <Text style={[styles.cancelText, { color: colors.text }]}>Cancel</Text>
                            </TouchableOpacity>
                          </>
                        ) : (
                          <>
                        <Text style={[styles.commentText, { color: colors.textSecondary }]}>{c.text}</Text>
                            {c.author === userEmail && (
                              <TouchableOpacity onPress={() => handleEditComment(c.id, c.text)} style={{ marginLeft: 8 }}>
                            <Ionicons name="pencil" size={16} color={colors.blue} />
                              </TouchableOpacity>
                            )}
                          </>
                        )}
                      </View>
                    ))
                  ) : (
                <Text style={[styles.noComments, { color: colors.textSecondary }]}>No comments yet.</Text>
                  )}
              
                  <TextInput
                    placeholder="Add a comment..."
                placeholderTextColor={colors.textSecondary}
                    value={comment}
                    onChangeText={setComment}
                style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                  />
              
              <TouchableOpacity onPress={() => handleAddComment(selectedIdea.id)} style={[styles.submitBtn, { backgroundColor: colors.blue }]}>
                    <Text style={styles.submitText}>Comment</Text>
                  </TouchableOpacity>
              
                  <TouchableOpacity
                    onPress={() => togglePromoteIdea(selectedIdea.id)}
                style={[styles.promoteBtn, { backgroundColor: colors.success }]}
                  >
                <Ionicons name="rocket" size={18} color={colors.white} />
                    <Text style={styles.promoteText}>
                      {selectedIdea.promotedBy.includes(userEmail) ? 'Unpromote' : 'Promote to Project/Issue'}
                    </Text>
                  </TouchableOpacity>
              
                  <TouchableOpacity onPress={() => setSelectedIdeaId(null)} style={styles.cancelBtn}>
                <Text style={[styles.cancelText, { color: colors.text }]}>Close</Text>
                  </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20,
    paddingTop: 40,
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  addBtn: { 
    borderRadius: 22, 
    width: 44, 
    height: 44, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabsContent: {
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: { 
    padding: 20 
  },
  ideaCard: { 
    borderRadius: 12, 
    padding: 16, 
    marginBottom: 16, 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ideaHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ideaTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  ideaTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 8,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  upvoteBtn: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  upvoteCount: { 
    marginLeft: 4, 
    fontWeight: 'bold',
    fontSize: 16,
  },
  ideaDesc: { 
    marginBottom: 12, 
    fontSize: 15, 
    lineHeight: 20,
  },
  ideaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ideaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  impactText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ideaStatus: { 
    fontSize: 13,
    textTransform: 'capitalize',
  },
  ideaStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreTags: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  modalOverlay: { 
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 100,
  },
  modalContent: { 
    borderRadius: 16, 
    padding: 20, 
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: 'bold',
    flex: 1,
  },
  modalScroll: {
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: { 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12, 
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    minHeight: 100,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  impactOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  impactOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  impactOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalActions: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: { 
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  cancelText: { 
    fontWeight: 'bold',
    fontSize: 16,
  },
  submitBtn: { 
    borderRadius: 8, 
    padding: 12, 
    alignItems: 'center',
    minWidth: 100,
  },
  submitText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 16, 
    marginBottom: 8 
  },
  comment: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  commentAuthor: { 
    fontWeight: 'bold', 
    marginRight: 4,
    fontSize: 14,
  },
  commentText: { 
    fontSize: 14,
    flex: 1,
  },
  noComments: { 
    fontStyle: 'italic', 
    marginBottom: 8,
    fontSize: 14,
  },
  promoteBtn: { 
    borderRadius: 8, 
    padding: 12, 
    alignItems: 'center', 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 12,
    gap: 6,
  },
  promoteText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  ideaDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 